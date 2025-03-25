'use client';
import { useCallback, useMemo } from 'react';
import { useBorrowAddCollateralFormStore } from '../store/borrow-add-collateral-form.store';
import { CollateralToken, Web3Address } from '@/types/web3';
import { useTokenStore } from '@/store/useTokenStore';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';

/**
 * Hook to handle the borrow add collateral form inputs
 * @returns Form input state and handlers
 */
export function useBorrowAddCollateralFormInputs() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowAddCollateralFormStore((state) => state.amount);
	const token = useBorrowAddCollateralFormStore((state) => state.token);
	const setAmount = useBorrowAddCollateralFormStore(
		(state) => state.setAmount
	);
	const setToken = useBorrowAddCollateralFormStore((state) => state.setToken);

	const availableCollateralTokens = useTokenStore(
		(state) => state.collateralTokens
	);

	const {
		data: walletBalance,
		isFetching: walletBalanceLoading,
		isError: walletBalanceError,
		refetch: refetchWalletBalance,
	} = useBalance({
		address: token?.address as Web3Address,
	});

	// Get formatted wallet balance
	const formattedWalletBalance = useMemo(() => {
		if (!walletBalance || !token) return '0';
		return formatUnits(walletBalance.value, token.decimals);
	}, [walletBalance, token]);

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
		if (!token || !token.availableCollateral) return 0;
		const percentage =
			(parseFloat(amount) / token.availableCollateral) * 100;
		return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
	}, [amount, token]);

	// Handle max click
	const handleMaxClick = useCallback(() => {
		if (!token) return;

		// Set amount to max available collateral
		const maxAmount = token.availableCollateral?.toString() || '0';
		setAmount(maxAmount);

		// Using setMaxAmount from the store if needed
		// setMaxAmount();
	}, [token, setAmount]);

	// Handle slider change
	const handleSliderChange = useCallback(
		(values: number[]) => {
			if (!token || !token.availableCollateral) return;

			const percentage = values[0];

			// Calculate amount based on percentage
			const calculatedAmount =
				(percentage / 100) * token.availableCollateral;
			setAmount(calculatedAmount.toString());
		},
		[token, setAmount]
	);

	// Handle token change
	const handleTokenChange = useCallback(
		(newToken: CollateralToken) => {
			setToken(newToken);
			setAmount('');
		},
		[setToken, setAmount]
	);

	return {
		amount,
		sliderPercentage,
		token,
		availableCollateralTokens,
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
