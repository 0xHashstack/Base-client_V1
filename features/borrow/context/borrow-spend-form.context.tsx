'use client';
import React, { ReactNode } from 'react';
import { BorrowSpendFormProvider } from '../store/borrow-spend-form.store';
import { HstkToken } from '@/types/web3/token.types';

interface BorrowSpendFormContextProviderProps {
	children: ReactNode;
	initialMarket?: HstkToken | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowSpendFormContextProvider({
	children,
	initialMarket = null,
}: BorrowSpendFormContextProviderProps) {
	return (
		<BorrowSpendFormProvider initialMarket={initialMarket}>
			{children}
		</BorrowSpendFormProvider>
	);
}

// Re-export the useBorrowSpendFormStore for convenience
export { useBorrowSpendFormStore } from '../store/borrow-spend-form.store';
