import { useCallback, useMemo } from 'react';
import { useSupplyFormStore } from '../store/supply-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { Web3Address } from '@/types/web3';
import { SupplyMarketData } from '@/types/web3/supply-market.types';
import { useWalletTokenBalance } from '@/hooks/useWalletTokenBalance';

/**
 * Hook to manage supply form input logic
 * @returns Form input state and handlers
 */
export function useSupplyFormInputs() {
	const amount = useSupplyFormStore((state) => state.amount);
	const market = useSupplyFormStore((state) => state.market);
	const setAmount = useSupplyFormStore((state) => state.setAmount);
	const setMarket = useSupplyFormStore((state) => state.setMarket);

	// Get tokens from token store
	const supplyMarket = useTokenStore((state) => state.supplyMarketData);

	const {
		data: walletBalance,
		isError: walletBalanceError,
		isLoading: walletBalanceLoading,
		refetch: refetchWalletBalance,
		formatted: formattedWalletBalance,
	} = useWalletTokenBalance(market?.asset.address_ as Web3Address, {
		decimals: market?.asset.decimals,
	});

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
	 * Handle amount change from input
	 * @param e Input change event
	 */
	const handleAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			// Validate input: only allow numbers and decimals
			if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
				setAmount(value);
			}
		},
		[setAmount]
	);

	/**
	 * Handle max button click
	 */
	const handleMaxClick = useCallback(() => {
		if (walletBalanceLoading || walletBalanceError || MAX_AMOUNT <= 0)
			return;
		setAmount(parseFloat(formattedWalletBalance).toFixed(3));
	}, [
		setAmount,
		formattedWalletBalance,
		walletBalanceLoading,
		walletBalanceError,
		MAX_AMOUNT,
	]);

	/**
	 * Handle slider change
	 * @param value Slider value array (0-100)
	 */
	const handleSliderChange = useCallback(
		(value: number[]) => {
			if (walletBalanceLoading || walletBalanceError || MAX_AMOUNT <= 0)
				return;

			const percentage = value[0];
			const newAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(newAmount.toFixed(3));
		},
		[setAmount, MAX_AMOUNT, walletBalanceLoading, walletBalanceError]
	);

	/**
	 * Handle token change
	 * @param tokenAddress Token address
	 * @param selectedToken Selected token object
	 */
	const handleTokenChange = useCallback(
		(tokenAddress: string, selectedToken: SupplyMarketData) => {
			setMarket(selectedToken);
		},
		[setMarket]
	);

	/**
	 * Handle wallet balance refresh
	 */
	const handleRefreshBalance = useCallback(() => {
		refetchWalletBalance();
	}, [refetchWalletBalance]);

	// Check if form inputs should be disabled
	const isFormDisabled = useMemo(() => {
		return walletBalanceError || MAX_AMOUNT <= 0;
	}, [walletBalanceError, MAX_AMOUNT]);

	return {
		amount,
		amountValue,
		sliderPercentage,
		MAX_AMOUNT,
		market,
		supplyMarket,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
		handleRefreshBalance,
		walletBalance,
		formattedWalletBalance,
		walletBalanceLoading,
		walletBalanceError,
		isFormDisabled,
	};
}
