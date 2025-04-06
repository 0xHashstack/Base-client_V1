'use client';
import { useCallback } from 'react';
import { useBorrowSpendFormStore } from '../store/borrow-spend-form.store';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import { useTokenStore } from '@/store/useTokenStore';

/**
 * Custom hook for borrow spend form inputs
 * Encapsulates the logic for the form inputs component
 */
export const useBorrowSpendFormInputs = () => {
	// Get state from the store using individual selectors (preferred pattern)
	const market = useBorrowSpendFormStore((state) => state.market);
	const setMarket = useBorrowSpendFormStore((state) => state.setMarket);
	const userAllLoans = useTokenStore((state) => state.userAllLoans);

	/**
	 * Handle market change
	 */
	const handleMarketChange = useCallback(
		(selectedMarket: LoanPosition) => {
			setMarket(selectedMarket);
		},
		[setMarket]
	);

	return {
		market,
		handleMarketChange,
		userAllLoans,
	};
};
