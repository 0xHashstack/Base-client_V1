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
	const market = useSupplyFormStore((state) => state.market);
	const setAmount = useSupplyFormStore((state) => state.setAmount);
	const setMarket = useSupplyFormStore((state) => state.setMarket);
	const setIsLoading = useSupplyFormStore((state) => state.setIsLoading);
	const reset = useSupplyFormStore((state) => state.reset);

	const { closeDrawer } = useEarnDrawer();

	/**
	 * Handle supply submission
	 */
	const handleSupply = useCallback(async () => {
		if (!market) return;

		try {
			setIsLoading(true);

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
	}, [market, closeDrawer, setIsLoading, reset]);

	return {
		// State
		amount,
		isLoading,
		market,
		handleSupply,

		// Actions
		setAmount,
		setMarket,
		reset,
		closeDrawer,
	};
}
