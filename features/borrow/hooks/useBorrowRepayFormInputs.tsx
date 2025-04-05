'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useBorrowRepayFormStore } from '../store/borrow-repay-form.store';
import { useWalletToken } from '@/context/wallet-token-provider';
import '@prototype/bigint.prototype';
import { useTokenStore } from '@/store/useTokenStore';
/**
 * Hook to handle the borrow repay form inputs
 * @returns Form input state and handlers
 */
export function useBorrowRepayFormInputs() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowRepayFormStore((state) => state.amount);
	const borrowMarket = useBorrowRepayFormStore((state) => state.marketLoan);
	const setAmount = useBorrowRepayFormStore((state) => state.setAmount);
	const userLoans = useTokenStore((state) => state.userAllLoans);

	const repayAmount = useMemo(() => {
		if (!borrowMarket?.repayFees) return 0;
		console.log(
			borrowMarket.repayFees,
			borrowMarket.borrowedAsset.decimals,
			borrowMarket.repayFees?.format(borrowMarket.borrowedAsset.decimals)
		);
		return (
			borrowMarket.repayFees
				?.format(borrowMarket.borrowedAsset.decimals)
				.toFixed(3) || '0.00'
		);
	}, [borrowMarket?.repayFees, borrowMarket?.borrowedAsset?.decimals]);

	const {
		data: walletBalance,
		isLoading: walletBalanceLoading,
		isError: walletBalanceError,
		refetch: refetchWalletBalance,
		formatted: formattedWalletBalance,
		formattedNumber: formattedWalletBalanceNumber,
	} = useWalletToken();

	// Maximum amount for the slider (from wallet balance)
	const MAX_AMOUNT = useMemo(() => {
		if (
			walletBalanceLoading ||
			walletBalanceError ||
			!formattedWalletBalanceNumber
		)
			return 0;
		return formattedWalletBalanceNumber;
	}, [
		formattedWalletBalanceNumber,
		walletBalanceLoading,
		walletBalanceError,
	]);

	// Check if form inputs should be disabled
	const isFormDisabled = useMemo(() => {
		return true;
		// return walletBalanceError || MAX_AMOUNT <= 0;
	}, []);

	// Handle amount change
	const handleAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newAmount = e.target.value;
			setAmount(newAmount);
		},
		[setAmount]
	);

	const sliderPercentage = useMemo(() => {
		if (!borrowMarket || MAX_AMOUNT <= 0) return 0;
		const percentage = (parseFloat(amount) / MAX_AMOUNT) * 100;
		return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
	}, [amount, borrowMarket, MAX_AMOUNT]);

	// Handle max click
	const handleMaxClick = useCallback(() => {
		if (!borrowMarket || MAX_AMOUNT <= 0) return;

		// Set amount to max available in wallet
		setAmount(MAX_AMOUNT.toFixed(3));
	}, [borrowMarket, setAmount, MAX_AMOUNT]);

	// Handle slider change
	const handleSliderChange = useCallback(
		(values: number[]) => {
			if (!borrowMarket || MAX_AMOUNT <= 0) return;

			const percentage = values[0];

			// Calculate amount based on percentage
			const calculatedAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(calculatedAmount.toFixed(3));
		},
		[borrowMarket, setAmount, MAX_AMOUNT]
	);

	// Handle token change
	const handleTokenChange = () => {};

	// Calculate fee whenever amount changes
	useEffect(() => {
		if (!amount || !borrowMarket) return;
	}, [amount, borrowMarket]);

	return {
		amount,
		sliderPercentage,
		borrowMarket,

		userLoans,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
		walletBalanceLoading,
		walletBalanceError,
		refetchWalletBalance,
		walletBalance,
		isFormDisabled,
		formattedWalletBalance,
		repayAmount,
	};
}
