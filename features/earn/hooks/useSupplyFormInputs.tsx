import { useCallback, useMemo } from 'react';
import { useSupplyFormStore } from '../store/supply-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { HstkToken } from '@/types/web3/token.types';

/**
 * Hook to manage supply form input logic
 * @returns Form input state and handlers
 */
export function useSupplyFormInputs() {
	const amount = useSupplyFormStore((state) => state.amount);
	const token = useSupplyFormStore((state) => state.token);
	const setAmount = useSupplyFormStore((state) => state.setAmount);
	const setMaxAmount = useSupplyFormStore((state) => state.setMaxAmount);
	const setToken = useSupplyFormStore((state) => state.setToken);
	
	// Get tokens from token store
	const tokens = useTokenStore((state) => state.tokens);

	// Maximum amount for the slider (from the setMaxAmount function)
	const MAX_AMOUNT = 1000;

	// Convert amount string to number for slider
	const amountValue = useMemo(() => {
		const parsed = parseFloat(amount);
		return isNaN(parsed) ? 0 : parsed;
	}, [amount]);

	// Calculate slider percentage (0-100)
	const sliderPercentage = useMemo(() => {
		return (amountValue / MAX_AMOUNT) * 100;
	}, [amountValue]);

	/**
	 * Handle amount change from input
	 * @param e Input change event
	 */
	const handleAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setAmount(e.target.value);
		},
		[setAmount]
	);

	/**
	 * Handle max button click
	 */
	const handleMaxClick = useCallback(() => {
		setMaxAmount();
	}, [setMaxAmount]);

	/**
	 * Handle slider change
	 * @param value Slider value array (0-100)
	 */
	const handleSliderChange = useCallback(
		(value: number[]) => {
			const percentage = value[0];
			const newAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(newAmount.toString());
		},
		[setAmount]
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
	};
}
