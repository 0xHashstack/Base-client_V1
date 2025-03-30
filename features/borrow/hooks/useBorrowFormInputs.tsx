'use client';
import { useCallback, useMemo } from 'react';
import { useBorrowFormStore } from '../store/borrow-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import {
	BorrowMarketCollateral,
	MarketLoan,
} from '@/types/web3/borrow-market.types';
import { useWalletToken } from '@/context/wallet-token-provider';
import '@prototype/bigint.prototype';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { formatUnits } from 'viem';

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

	const collateralMarketList = useTokenStore(
		(state) => state.borrowMarketCollateral
	);

	const borrowMarketList = useTokenStore((state) => state.borrowMarketData);

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

	/**
	 * Supply functions
	 */

	// Handle amount change
	const handleAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newAmount = e.target.value;
			setAmount(newAmount);
		},
		[setAmount]
	);

	// Convert amount string to number for slider
	const amountValue = useMemo(() => {
		const parsed = parseFloat(amount);
		return isNaN(parsed) ? 0 : parsed;
	}, [amount]);

	// Calculate slider percentage (0-100)
	const sliderPercentage = useMemo(() => {
		if (MAX_AMOUNT <= 0) return 0;
		const percentage = (amountValue / MAX_AMOUNT) * 100;
		return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
	}, [amountValue, MAX_AMOUNT]);

	/**
	 * Handle max button click for collateral
	 */
	const handleMaxClick = useCallback(() => {
		if (!collateralMarket) return;
		if (walletBalanceLoading || walletBalanceError || MAX_AMOUNT <= 0)
			return;

		// Set to wallet balance (with 3 decimal places for readability)
		setAmount(parseFloat(formattedWalletBalance).toFixed(3));
	}, [
		setAmount,
		collateralMarket,
		formattedWalletBalance,
		walletBalanceLoading,
		walletBalanceError,
		MAX_AMOUNT,
	]);

	/**
	 * Handle slider change for collateral amount
	 * @param values Slider value array (0-100)
	 */
	const handleSliderChange = useCallback(
		(values: number[]) => {
			if (!collateralMarket) return;
			if (walletBalanceLoading || walletBalanceError || MAX_AMOUNT <= 0)
				return;

			const percentage = values[0];
			const newAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(newAmount.toFixed(3));
		},
		[
			setAmount,
			collateralMarket,
			MAX_AMOUNT,
			walletBalanceLoading,
			walletBalanceError,
		]
	);

	// Handle token change
	const handleTokenChange = useCallback(
		(newToken: BorrowMarketCollateral) => {
			setCollateralMarket(newToken);
			setAmount('');
		},
		[setCollateralMarket, setAmount]
	);

	/**
	 * Borrow functions
	 */

	// Handle borrow market change
	const handleBorrowMarketChange = useCallback(
		(newToken: MarketLoan) => {
			setBorrowMarket(newToken);
		},
		[setBorrowMarket]
	);

	// Handle borrow amount change
	const handleBorrowAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newAmount = e.target.value;
			setBorrowAmount(newAmount);
		},
		[setBorrowAmount]
	);

	// Calculate maximum borrowable amount based on collateral amount and price ratio
	const maxBorrowAmount = useMemo(() => {
		if (!borrowMarket || !collateralMarket || !amount) return 0;

		try {
			// Convert string amount to number
			const collateralAmountNum = parseFloat(amount);
			if (isNaN(collateralAmountNum) || collateralAmountNum <= 0)
				return 0;

			// Get prices from both assets (they are bigint)
			const collateralPrice = collateralMarket.priceUSD;
			const borrowPrice = borrowMarket.asset.priceUSD;

			if (borrowPrice === BigInt(0)) return 0; // Avoid division by zero

			// Get token decimals
			const collateralDecimals = collateralMarket.decimals;
			const borrowDecimals = borrowMarket.asset.decimals;

			// Calculate the price ratio (convert bigint to number for calculation)
			// Adjust for different token decimals when calculating the price ratio
			const normalizedCollateralPrice = Number(
				formatUnits(collateralPrice, collateralDecimals)
			);
			const normalizedBorrowPrice = Number(
				formatUnits(borrowPrice, borrowDecimals)
			);
			const priceRatio =
				normalizedCollateralPrice / normalizedBorrowPrice;

			// Calculate max borrow (5x leverage adjusted by price ratio)
			return collateralAmountNum * 5 * priceRatio;
		} catch (error) {
			console.error('Error calculating max borrow amount:', error);
			return 0;
		}
	}, [borrowMarket, collateralMarket, amount]);

	// Handle borrow max click
	const handleBorrowMaxClick = useCallback(() => {
		if (!borrowMarket || !collateralMarket || maxBorrowAmount <= 0) return;

		// Set to max borrowable amount
		setBorrowAmount(maxBorrowAmount.toFixed(3));
	}, [borrowMarket, collateralMarket, maxBorrowAmount, setBorrowAmount]);

	// Convert borrow amount string to number for slider
	const borrowAmountValue = useMemo(() => {
		const parsed = parseFloat(borrowAmount);
		return isNaN(parsed) ? 0 : parsed;
	}, [borrowAmount]);

	// Borrow slider percentage
	const borrowSliderPercentage = useMemo(() => {
		if (maxBorrowAmount <= 0) return 0;
		const percentage = (borrowAmountValue / maxBorrowAmount) * 100;
		return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
	}, [borrowAmountValue, maxBorrowAmount]);

	// Handle borrow slider change
	const handleBorrowSliderChange = useCallback(
		(values: number[]) => {
			if (!borrowMarket || !collateralMarket || maxBorrowAmount <= 0)
				return;

			const percentage = values[0];

			// Calculate amount based on percentage of max borrow amount
			const calculatedAmount = (percentage / 100) * maxBorrowAmount;
			setBorrowAmount(calculatedAmount.toFixed(3));
		},
		[borrowMarket, collateralMarket, maxBorrowAmount, setBorrowAmount]
	);

	const availableReserve = useMemo(() => {
		if (!borrowMarket) return 0;
		return borrowMarket.availableToBorrow.formatBalance(
			DECIMALS.BORROW_MARKET
		);
	}, [borrowMarket]);

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
		maxBorrowAmount,
	};
}
