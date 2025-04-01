'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useBorrowRepayFormStore } from '../store/borrow-repay-form.store';
import { useWalletToken } from '@/context/wallet-token-provider';

/**
 * Hook to handle the borrow repay form inputs
 * @returns Form input state and handlers
 */
export function useBorrowRepayFormInputs() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowRepayFormStore((state) => state.amount);
	const borrowMarket = useBorrowRepayFormStore((state) => state.token);
	const fee = useBorrowRepayFormStore((state) => state.fee);
	const setAmount = useBorrowRepayFormStore((state) => state.setAmount);
	const setFee = useBorrowRepayFormStore((state) => state.setFee);

	const {
		data: walletBalance,
		isLoading: walletBalanceLoading,
		isError: walletBalanceError,
		refetch: refetchWalletBalance,
		formatted: formattedWalletBalance,
	} = useWalletToken();

	// Maximum amount for the slider (from wallet balance)
	const MAX_AMOUNT = useMemo(() => {
		if (
			walletBalanceLoading ||
			walletBalanceError ||
			!formattedWalletBalance
		)
			return 0;
		return parseFloat(formattedWalletBalance);
	}, [formattedWalletBalance, walletBalanceLoading, walletBalanceError]);

	// Check if form inputs should be disabled
	const isFormDisabled = useMemo(() => {
		return walletBalanceError || MAX_AMOUNT <= 0;
	}, [walletBalanceError, MAX_AMOUNT]);

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
		setAmount(MAX_AMOUNT.toString());
	}, [borrowMarket, setAmount, MAX_AMOUNT]);

	// Handle slider change
	const handleSliderChange = useCallback(
		(values: number[]) => {
			if (!borrowMarket || MAX_AMOUNT <= 0) return;

			const percentage = values[0];

			// Calculate amount based on percentage
			const calculatedAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(calculatedAmount.toString());
		},
		[borrowMarket, setAmount, MAX_AMOUNT]
	);

	// Handle token change
	const handleTokenChange = () => {};

	// Calculate fee whenever amount changes
	useEffect(() => {
		if (!amount || !borrowMarket) return;

		// Simple fee calculation (0.5% of amount)
		const feeAmount = parseFloat(amount) * 0.005;
		setFee(feeAmount.toFixed(4));
	}, [amount, borrowMarket, setFee]);

	return {
		amount,
		sliderPercentage,
		borrowMarket,
		fee,
		borrowTokens: [],
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
	};
}
