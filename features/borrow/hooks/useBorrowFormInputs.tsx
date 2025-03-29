'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useBorrowFormStore } from '../store/borrow-form.store';
import { Web3Address } from '@/types/web3';
import { useTokenStore } from '@/store/useTokenStore';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import {
	BorrowMarketCollateral,
	MarketLoan,
} from '@/types/web3/borrow-market.types';

/**
 * Hook to handle the borrow form inputs
 * @returns Form input state and handlers
 */
export function useBorrowFormInputs() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowFormStore((state) => state.amount);
	const collateralMarket = useBorrowFormStore(
		(state) => state.collateralMarket
	);
	const borrowAmount = useBorrowFormStore((state) => state.borrowAmount);
	const borrowMarket = useBorrowFormStore((state) => state.borrowMarket);
	const setAmount = useBorrowFormStore((state) => state.setAmount);
	const setCollateralMarket = useBorrowFormStore(
		(state) => state.setCollateralMarket
	);
	const setBorrowAmount = useBorrowFormStore(
		(state) => state.setBorrowAmount
	);
	const setBorrowMarket = useBorrowFormStore(
		(state) => state.setBorrowMarket
	);
	const setBorrowMaxAmount = useBorrowFormStore(
		(state) => state.setBorrowMaxAmount
	);

	const collateralMarketList = useTokenStore(
		(state) => state.borrowMarketCollateral
	);

	const borrowMarketList = useTokenStore((state) => state.borrowMarketData);

	const {
		data: walletBalance,
		isFetching: walletBalanceLoading,
		isError: walletBalanceError,
		refetch: refetchWalletBalance,
	} = useBalance({
		address: collateralMarket?.address as Web3Address,
	});

	// Get formatted wallet balance
	const formattedWalletBalance = useMemo(() => {
		if (!walletBalance || !collateralMarket) return '0';
		return formatUnits(walletBalance.value, collateralMarket.decimals);
	}, [walletBalance, collateralMarket]);

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
		// if (!collateralMarket || !collateralMarket.availableCollateral)
		// 	return 0;
		// const percentage =
		// 	(parseFloat(amount) / collateralMarket.availableCollateral) * 100;
		// return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
		return 0;
	}, [amount, collateralMarket]);

	// Handle max click
	const handleMaxClick = useCallback(() => {
		if (!collateralMarket) return;

		// Set amount to max available collateral
		// const maxAmount =
		// 	collateralMarket.availableCollateral?.toString() || '0';
		// setAmount(maxAmount);
	}, [collateralMarket, setAmount]);

	// Handle slider change
	const handleSliderChange = useCallback(
		(values: number[]) => {
			// if (!collateralMarket || !collateralMarket.availableCollateral)
			// 	return;

			// const percentage = values[0];

			// // Calculate amount based on percentage
			// const calculatedAmount =
			// 	(percentage / 100) * collateralMarket.availableCollateral;
			// setAmount(calculatedAmount.toString());
			return 0;
		},
		[collateralMarket, setAmount]
	);

	// Handle token change
	const handleTokenChange = useCallback(
		(newToken: BorrowMarketCollateral) => {
			setCollateralMarket(newToken);
			setAmount('');
		},
		[setCollateralMarket, setAmount]
	);

	// Handle borrow market change
	const handleBorrowMarketChange = useCallback(
		(newToken: MarketLoan) => {
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
		collateralMarket,
		collateralMarketList,
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
		borrowMarketList,
		borrowSliderPercentage,
		availableReserve,
		handleBorrowAmountChange,
		handleBorrowMaxClick,
		handleBorrowMarketChange,
		handleBorrowSliderChange,
	};
}
