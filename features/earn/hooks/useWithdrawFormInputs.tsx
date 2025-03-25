import { useCallback, useMemo } from 'react';
import { useSupplyWithdrawFormStore } from '../store/supply-withdraw-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { useBalance } from 'wagmi';
import { Web3Address } from '@/types/web3';
import { formatUnits } from 'viem';
import { SupplyPosition } from '@/types/web3/supply-market.types';

/**
 * Hook to manage withdraw form input logic
 * @returns Form input state and handlers
 */
export function useWithdrawFormInputs() {
	const amount = useSupplyWithdrawFormStore((state) => state.amount);
	const position = useSupplyWithdrawFormStore(
		(state) => state.supplyPosition
	);
	const setAmount = useSupplyWithdrawFormStore((state) => state.setAmount);
	const setPosition = useSupplyWithdrawFormStore(
		(state) => state.setSupplyPosition
	);

	// Get tokens from token store
	const supplyPositions = useTokenStore((state) => state.userSupplyPositions);

	const {
		data: walletBalance,
		isFetching: walletBalanceLoading,
		isError: walletBalanceError,
		refetch: refetchWalletBalance,
	} = useBalance({
		address: position?.supplyAsset.address_ as Web3Address,
	});

	// Get formatted wallet balance
	const formattedWalletBalance = useMemo(() => {
		if (!walletBalance || !position) return '0';
		return formatUnits(walletBalance.value, position.supplyAsset.decimals);
	}, [walletBalance, position]);

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
			setAmount(newAmount.toFixed(position?.supplyAsset.decimals || 6));
		},
		[
			setAmount,
			MAX_AMOUNT,
			walletBalanceLoading,
			walletBalanceError,
			position,
		]
	);

	/**
	 * Handle token change
	 * @param tokenAddress Token address
	 * @param selectedToken Selected token object
	 */
	const handleTokenChange = useCallback(
		(tokenAddress: string, selectedToken: SupplyPosition) => {
			setPosition(selectedToken);
		},
		[setPosition]
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
		position,
		supplyPositions,
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
