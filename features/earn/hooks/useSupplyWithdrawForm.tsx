'use client';
import { useCallback } from 'react';
import { useSupplyWithdrawFormStore } from '../store/supply-withdraw-form.store';
import { useEarnDrawer } from '../context/earn-drawer.context';

/**
 * Hook to handle the withdraw form functionality
 * @returns Withdraw form state and handlers
 */
export function useSupplyWithdrawForm() {
	// Use selectors to get only what we need from the store
	const amount = useSupplyWithdrawFormStore((state) => state.amount);
	const isLoading = useSupplyWithdrawFormStore((state) => state.isLoading);
	const token = useSupplyWithdrawFormStore((state) => state.token);
	const setAmount = useSupplyWithdrawFormStore((state) => state.setAmount);
	const setToken = useSupplyWithdrawFormStore((state) => state.setToken);
	const setIsLoading = useSupplyWithdrawFormStore(
		(state) => state.setIsLoading
	);
	const reset = useSupplyWithdrawFormStore((state) => state.reset);

	const { closeDrawer } = useEarnDrawer();

	/**
	 * Handle withdraw submission
	 */
	const handleWithdraw = useCallback(async () => {
		if (!token) return;

		try {
			setIsLoading(true);
			// In a real implementation, this would call the contract to withdraw tokens
			console.log(`Withdrawing ${amount} ${token.symbol}`);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Close the drawer after successful withdrawal
			closeDrawer();

			// Reset the form
			reset();
		} catch (error) {
			console.error('Error withdrawing tokens:', error);
		} finally {
			setIsLoading(false);
		}
	}, [amount, token, closeDrawer, setIsLoading, reset]);

	return {
		// State
		amount,
		isLoading,
		token,
		handleWithdraw,

		// Actions
		setAmount,
		setToken,
		reset,
		closeDrawer,
	};
}
