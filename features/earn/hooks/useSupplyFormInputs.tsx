import { useCallback, useMemo } from 'react';
import { useSupplyFormStore } from '../store/supply-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { HstkToken } from '@/types/web3/token.types';
import { useBalance } from 'wagmi';
import { Web3Address } from '@/types/web3';
import { formatUnits } from 'viem';

/**
 * Hook to manage supply form input logic
 * @returns Form input state and handlers
 */
export function useSupplyFormInputs() {
	const amount = useSupplyFormStore((state) => state.amount);
	const token = useSupplyFormStore((state) => state.token);
	const setAmount = useSupplyFormStore((state) => state.setAmount);
	const setToken = useSupplyFormStore((state) => state.setToken);

	// Get tokens from token store
	const tokens = useTokenStore((state) => state.tokens);

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
		setAmount(formattedWalletBalance);
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
			setAmount(newAmount.toFixed(token?.decimals || 6));
		},
		[setAmount, MAX_AMOUNT, walletBalanceLoading, walletBalanceError, token]
	);

	/**
	 * Handle token change
	 * @param tokenAddress Token address
	 * @param selectedToken Selected token object
	 */
	const handleTokenChange = useCallback(
		(tokenAddress: string, selectedToken: HstkToken) => {
			setToken(selectedToken);
		},
		[setToken]
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
		token,
		tokens,
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
