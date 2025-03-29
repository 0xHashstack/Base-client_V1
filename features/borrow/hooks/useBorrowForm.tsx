'use client';
import { useCallback } from 'react';
import { useBorrowFormStore } from '../store/borrow-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';

/**
 * Hook to handle the borrow form functionality
 * @returns Borrow form state and handlers
 */
export function useBorrowForm() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowFormStore((state) => state.amount);
	const isLoading = useBorrowFormStore((state) => state.isLoading);
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
	const setIsLoading = useBorrowFormStore((state) => state.setIsLoading);
	const reset = useBorrowFormStore((state) => state.reset);

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

	/**
	 * Handle borrow submission
	 */
	const handleBorrow = useCallback(async () => {
		if (!collateralMarket || !borrowMarket || !borrowAmount) return;

		try {
			setIsLoading(true);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Close the drawer after successful borrowing
			closeDrawer();

			// Reset the form
			reset();
		} catch (error) {
			console.error('Error borrowing:', error);
		} finally {
			setIsLoading(false);
		}
	}, [
		collateralMarket,
		borrowAmount,
		borrowMarket,
		closeDrawer,
		setIsLoading,
		reset,
	]);

	return {
		// State
		amount,
		isLoading,
		collateralMarket,
		borrowAmount,
		borrowMarket,
		handleBorrow,

		// Actions
		setAmount,
		setCollateralMarket,
		setBorrowAmount,
		setBorrowMarket,
		reset,
		closeDrawer,
	};
}
