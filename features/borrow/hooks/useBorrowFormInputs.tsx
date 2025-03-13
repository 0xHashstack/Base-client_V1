'use client';
import { useCallback, useMemo } from 'react';
import { useBorrowFormStore } from '../store/borrow-form.store';
import { CollateralToken, HstkToken, Web3Address } from '@/types/web3';
import { useTokenStore } from '@/store/useTokenStore';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';

/**
 * Hook to handle the borrow form inputs
 * @returns Form input state and handlers
 */
export function useBorrowFormInputs() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowFormStore((state) => state.amount);
	const token = useBorrowFormStore((state) => state.token);
	const borrowAmount = useBorrowFormStore((state) => state.borrowAmount);
	const borrowMarket = useBorrowFormStore((state) => state.borrowMarket);
	const setAmount = useBorrowFormStore((state) => state.setAmount);
	const setToken = useBorrowFormStore((state) => state.setToken);
	const setBorrowAmount = useBorrowFormStore((state) => state.setBorrowAmount);
	const setBorrowMarket = useBorrowFormStore((state) => state.setBorrowMarket);
	const setBorrowMaxAmount = useBorrowFormStore((state) => state.setBorrowMaxAmount);

	const availableCollateralTokens = useTokenStore((state) => state.collateralTokens);
	const borrowMarketTokens = useTokenStore((state) => state.borrowMarketTokens);

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

	// Handle borrow market change
	const handleBorrowMarketChange = useCallback(
		(newToken: HstkToken) => {
			setBorrowMarket(newToken);
			setBorrowAmount('');
		},
		[setBorrowMarket, setBorrowAmount]
	);

	// Handle borrow amount change
	const handleBorrowAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newAmount = e.target.value;
			setBorrowAmount(newAmount);
		},
		[setBorrowAmount]
	);

	// Handle borrow max click
	const handleBorrowMaxClick = useCallback(() => {
		if (!borrowMarket) return;

		// Set amount to max available in reserve (hardcoded for now)
		setBorrowMaxAmount();
	}, [borrowMarket, setBorrowMaxAmount]);

	// Available reserve (hardcoded for now)
	const availableReserve = useMemo(() => {
		return borrowMarket ? '10000' : '0';
	}, [borrowMarket]);

	// Borrow slider percentage
	const borrowSliderPercentage = useMemo(() => {
		if (!borrowMarket || !availableReserve) return 0;
		const percentage =
			(parseFloat(borrowAmount) / parseFloat(availableReserve)) * 100;
		return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
	}, [borrowAmount, borrowMarket, availableReserve]);

	// Handle borrow slider change
	const handleBorrowSliderChange = useCallback(
		(values: number[]) => {
			if (!borrowMarket || !availableReserve) return;

			const percentage = values[0];

			// Calculate amount based on percentage
			const calculatedAmount =
				(percentage / 100) * parseFloat(availableReserve);
			setBorrowAmount(calculatedAmount.toString());
		},
		[borrowMarket, availableReserve, setBorrowAmount]
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
		// Borrow market related
		borrowAmount,
		borrowMarket,
		borrowMarketTokens,
		borrowSliderPercentage,
		availableReserve,
		handleBorrowAmountChange,
		handleBorrowMaxClick,
		handleBorrowMarketChange,
		handleBorrowSliderChange,
	};
}
