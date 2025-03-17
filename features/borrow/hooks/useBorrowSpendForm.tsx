'use client';
import { useCallback } from 'react';
import { useBorrowSpendFormStore } from '../store/borrow-spend-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { HstkToken } from '@/types/web3/token.types';

/**
 * Hook to handle the borrow spend form functionality
 * @returns Borrow spend form state and handlers
 */
export function useBorrowSpendForm() {
	// Use selectors to get only what we need from the store
	const market = useBorrowSpendFormStore((state) => state.market);
	const isLoading = useBorrowSpendFormStore((state) => state.isLoading);
	const activeTab = useBorrowSpendFormStore((state) => state.activeTab);
	const setMarket = useBorrowSpendFormStore((state) => state.setMarket);
	const setIsLoading = useBorrowSpendFormStore((state) => state.setIsLoading);
	const setActiveTab = useBorrowSpendFormStore((state) => state.setActiveTab);
	const reset = useBorrowSpendFormStore((state) => state.reset);

	// Get available borrow tokens from the token store
	const borrowTokens = useTokenStore((state) => state.borrowTokens);

	/**
	 * Handle market change
	 */
	const handleMarketChange = useCallback((market: HstkToken) => {
		setMarket(market);
	}, [setMarket]);

	/**
	 * Handle tab change
	 */
	const handleTabChange = useCallback((tab: 'liquidity' | 'swap') => {
		setActiveTab(tab);
	}, [setActiveTab]);

	/**
	 * Handle liquidity provision submission
	 */
	const handleLiquidityProvision = useCallback(async () => {
		if (!market) return;

		try {
			setIsLoading(true);
			// In a real implementation, this would call the contract to provide liquidity
			console.log(`Providing liquidity for ${market.symbol}`);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Reset the form
			reset();
		} catch (error) {
			console.error('Error providing liquidity:', error);
		} finally {
			setIsLoading(false);
		}
	}, [market, setIsLoading, reset]);

	return {
		// State
		market,
		isLoading,
		activeTab,
		borrowTokens,

		// Actions
		setMarket,
		setActiveTab,
		handleMarketChange,
		handleTabChange,
		handleLiquidityProvision,
		reset,
	};
}
