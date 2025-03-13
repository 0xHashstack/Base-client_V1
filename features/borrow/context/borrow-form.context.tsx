'use client';
import React, { ReactNode } from 'react';
import { BorrowFormProvider } from '../store/borrow-form.store';
import { CollateralToken, HstkToken } from '@/types/web3/token.types';

interface BorrowFormContextProviderProps {
	children: ReactNode;
	token: CollateralToken | null;
	initialBorrowMarket?: HstkToken | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowFormContextProvider({
	children,
	token,
	initialBorrowMarket = null,
}: BorrowFormContextProviderProps) {
	return (
		<BorrowFormProvider initialToken={token} initialBorrowMarket={initialBorrowMarket}>
			{children}
		</BorrowFormProvider>
	);
}

// Re-export the useBorrowFormStore for convenience
export { useBorrowFormStore } from '../store/borrow-form.store';
