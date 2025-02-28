'use client';
import { useCallback } from 'react';
import { useSupplyFormStore } from '../store/supply-form.store';
import { useEarnDrawer } from '../context/earn-drawer.context';

/**
 * Hook to handle the supply form functionality
 * @returns Supply form state and handlers
 */
export function useSupplyForm() {
	// Use selectors to get only what we need from the store
	const amount = useSupplyFormStore((state) => state.amount);
	const isLoading = useSupplyFormStore((state) => state.isLoading);
	const token = useSupplyFormStore((state) => state.token);
	const setAmount = useSupplyFormStore((state) => state.setAmount);
	const setMaxAmount = useSupplyFormStore((state) => state.setMaxAmount);
	const setToken = useSupplyFormStore((state) => state.setToken);
	const setIsLoading = useSupplyFormStore((state) => state.setIsLoading);
	const reset = useSupplyFormStore((state) => state.reset);

	const { closeDrawer } = useEarnDrawer();

	/**
	 * Handle amount change
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
	 * Handle supply submission
	 */
	const handleSupply = useCallback(async () => {
		if (!token) return;

		try {
			setIsLoading(true);
			// In a real implementation, this would call the contract to supply tokens
			console.log(`Supplying ${amount} ${token.symbol}`);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Close the drawer after successful supply
			closeDrawer();

			// Reset the form
			reset();
		} catch (error) {
			console.error('Error supplying tokens:', error);
		} finally {
			setIsLoading(false);
		}
	}, [amount, token, closeDrawer, setIsLoading, reset]);

	return {
		// State
		amount,
		isLoading,
		token,

		// Handlers
		handleAmountChange,
		handleMaxClick,
		handleSupply,

		// Actions
		setAmount,
		setToken,
		reset,
		closeDrawer,
	};
}
