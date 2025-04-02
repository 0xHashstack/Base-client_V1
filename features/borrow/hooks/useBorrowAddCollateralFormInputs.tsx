'use client';
import { useCallback, useMemo } from 'react';
import { useBorrowAddCollateralFormStore } from '../store/borrow-add-collateral-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { useWalletToken } from '@/context/wallet-token-provider';

/**
 * Hook to handle the borrow add collateral form inputs
 * @returns Form input state and handlers
 */
export function useBorrowAddCollateralFormInputs() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowAddCollateralFormStore((state) => state.amount);
	const userLoan = useBorrowAddCollateralFormStore(
		(state) => state.loanPosition
	);
	const setAmount = useBorrowAddCollateralFormStore(
		(state) => state.setAmount
	);

	// We don't need to select from available tokens since we're using the loan's collateral
	// but we'll keep this for compatibility
	const userAllLoans = useTokenStore((state) => state.userAllLoans);
	const borrowMarketCollaterals = useTokenStore(
		(state) => state.borrowMarketCollateral
	);

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
		if (MAX_AMOUNT <= 0) return 0;
		if (!amount || isNaN(parseFloat(amount))) return 0;

		const percentage = (parseFloat(amount) / MAX_AMOUNT) * 100;
		return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
	}, [amount, MAX_AMOUNT]);

	// Handle max click
	const handleMaxClick = useCallback(() => {
		if (MAX_AMOUNT <= 0) return;

		// Set amount to max available in wallet
		setAmount(MAX_AMOUNT.toFixed(3));
	}, [MAX_AMOUNT, setAmount]);

	// Handle slider change
	const handleSliderChange = useCallback(
		(values: number[]) => {
			if (MAX_AMOUNT <= 0) return;

			const percentage = values[0];

			// Calculate amount based on percentage of wallet balance
			const calculatedAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(calculatedAmount.toFixed(3));
		},
		[MAX_AMOUNT, setAmount]
	);

	// Handle token change - this is now disabled since we're using the loan's collateral
	const handleTokenChange = () => {
		// This function is kept for compatibility but should not be used
		// as we're using the loan's collateral directly
	};

	return {
		amount,
		sliderPercentage,
		userLoan,
		userAllLoans,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
		walletBalanceLoading,
		walletBalanceError,
		refetchWalletBalance,
		walletBalance,
		isFormDisabled,
		borrowMarketCollaterals,
		formattedWalletBalance,
	};
}
