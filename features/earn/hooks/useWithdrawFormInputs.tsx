import { useCallback, useMemo } from 'react';
import { useSupplyWithdrawFormStore } from '../store/supply-withdraw-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { SupplyPosition } from '@/types/web3/supply-market.types';
// Import the BigInt prototype extension to ensure it's loaded
import '@prototype/bigint.prototype';

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

	// Determine if we're loading or have an error
	const availableBalanceLoading = useMemo(() => !position, [position]);
	const availableBalanceError = useMemo(() => false, []);

	// Get formatted available balance (supplied amount)
	const formattedAvailableBalance = useMemo(() => {
		if (!position) return '0';
		return position.receiptTokens.formatBalance(
			position.underlyingAsset.decimals
		);
	}, [position]);

	// Maximum amount for the slider (from supplied amount)
	const MAX_AMOUNT = useMemo(() => {
		if (
			availableBalanceLoading ||
			availableBalanceError ||
			!formattedAvailableBalance
		)
			return 0;
		return parseFloat(formattedAvailableBalance);
	}, [
		formattedAvailableBalance,
		availableBalanceLoading,
		availableBalanceError,
	]);

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
		if (availableBalanceLoading || availableBalanceError || MAX_AMOUNT <= 0)
			return;
		setAmount(parseFloat(formattedAvailableBalance).toFixed(3));
	}, [
		setAmount,
		formattedAvailableBalance,
		availableBalanceLoading,
		availableBalanceError,
		MAX_AMOUNT,
	]);

	/**
	 * Handle slider change
	 * @param value Slider value array (0-100)
	 */
	const handleSliderChange = useCallback(
		(value: number[]) => {
			if (
				availableBalanceLoading ||
				availableBalanceError ||
				MAX_AMOUNT <= 0
			)
				return;

			const percentage = value[0];
			const newAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(newAmount.toFixed(3));
		},
		[setAmount, MAX_AMOUNT, availableBalanceLoading, availableBalanceError]
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
	 * Handle balance refresh
	 * Note: This would need to be connected to a refetch mechanism for position data
	 */
	const handleRefreshBalance = useCallback(() => {
		// This would need to be implemented with a refetch mechanism for position data
		console.log('Refresh balance requested');
	}, []);

	// Check if form inputs should be disabled
	const isFormDisabled = useMemo(() => {
		return availableBalanceError || MAX_AMOUNT <= 0;
	}, [availableBalanceError, MAX_AMOUNT]);

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
		availableBalance: position?.suppliedAmount,
		formattedAvailableBalance,
		availableBalanceLoading,
		availableBalanceError,
		isFormDisabled,
	};
}
