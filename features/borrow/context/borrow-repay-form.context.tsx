'use client';
import React, { ReactNode } from 'react';
import { BorrowRepayFormProvider } from '../store/borrow-repay-form.store';
import { MarketLoan } from '@/types/web3/borrow-market.types';

interface BorrowRepayFormContextProviderProps {
	children: ReactNode;
	marketLoan: MarketLoan | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowRepayFormContextProvider({
	children,
	marketLoan,
}: BorrowRepayFormContextProviderProps) {
	return (
		<BorrowRepayFormProvider initialMarket={marketLoan}>
			{children}
		</BorrowRepayFormProvider>
	);
}

// Re-export the useBorrowRepayFormStore for convenience
export { useBorrowRepayFormStore } from '../store/borrow-repay-form.store';
