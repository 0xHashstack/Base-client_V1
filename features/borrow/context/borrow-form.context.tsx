'use client';
import React, { ReactNode } from 'react';
import { BorrowFormProvider } from '../store/borrow-form.store';
import { MarketLoan } from '@/types/web3/borrow-market.types';

interface BorrowFormContextProviderProps {
	children: ReactNode;
	initialBorrowMarket?: MarketLoan | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowFormContextProvider({
	children,

	initialBorrowMarket = null,
}: BorrowFormContextProviderProps) {
	return (
		<BorrowFormProvider initialBorrowMarket={initialBorrowMarket}>
			{children}
		</BorrowFormProvider>
	);
}

// Re-export the useBorrowFormStore for convenience
export { useBorrowFormStore } from '../store/borrow-form.store';
