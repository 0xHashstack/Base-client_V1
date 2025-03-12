'use client';
import { useCallback } from 'react';
import { useBorrowAddCollateralFormStore } from '../store/borrow-add-collateral-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';

/**
 * Hook to handle the borrow add collateral form functionality
 * @returns Borrow add collateral form state and handlers
 */
export function useBorrowAddCollateralForm() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowAddCollateralFormStore((state) => state.amount);
	const isLoading = useBorrowAddCollateralFormStore((state) => state.isLoading);
	const token = useBorrowAddCollateralFormStore((state) => state.token);
	const setAmount = useBorrowAddCollateralFormStore((state) => state.setAmount);
	const setToken = useBorrowAddCollateralFormStore((state) => state.setToken);
	const setIsLoading = useBorrowAddCollateralFormStore(
		(state) => state.setIsLoading
	);
	const reset = useBorrowAddCollateralFormStore((state) => state.reset);

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

	/**
	 * Handle add collateral submission
	 */
	const handleAddCollateral = useCallback(async () => {
		if (!token) return;

		try {
			setIsLoading(true);
			// In a real implementation, this would call the contract to add collateral
			console.log(`Adding ${amount} ${token.symbol} as collateral`);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Close the drawer after successful addition of collateral
			closeDrawer();

			// Reset the form
			reset();
		} catch (error) {
			console.error('Error adding collateral:', error);
		} finally {
			setIsLoading(false);
		}
	}, [amount, token, closeDrawer, setIsLoading, reset]);

	return {
		// State
		amount,
		isLoading,
		token,
		handleAddCollateral,

		// Actions
		setAmount,
		setToken,
		reset,
		closeDrawer,
	};
}
