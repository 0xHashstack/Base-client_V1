'use client';
import React, { ReactNode } from 'react';
import { BorrowSpendFormProvider } from '../store/borrow-spend-form.store';
import { LoanPosition } from '@/types/web3/borrow-market.types';

interface BorrowSpendFormContextProviderProps {
	children: ReactNode;
	marketLoan?: LoanPosition | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowSpendFormContextProvider({
	children,
	marketLoan: initialMarket = null,
}: BorrowSpendFormContextProviderProps) {
	return (
		<BorrowSpendFormProvider initialMarket={initialMarket}>
			{children}
		</BorrowSpendFormProvider>
	);
}

// Re-export the useBorrowSpendFormStore for convenience
export { useBorrowSpendFormStore } from '../store/borrow-spend-form.store';
