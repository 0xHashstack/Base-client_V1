'use client';
import React, { ReactNode } from 'react';
import { BorrowSwapToDebtFormProvider } from '../store/borrow-swap-to-debt-form.store';
import { LoanPosition } from '@/types/web3/borrow-market.types';

interface BorrowSwapToDebtFormContextProviderProps {
	children: ReactNode;
	marketLoan: LoanPosition | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowSwapToDebtFormContextProvider({
	children,
	marketLoan,
}: BorrowSwapToDebtFormContextProviderProps) {
	return (
		<BorrowSwapToDebtFormProvider initialMarket={marketLoan}>
			{children}
		</BorrowSwapToDebtFormProvider>
	);
}

// Re-export the useBorrowSwapToDebtFormStore for convenience
export { useBorrowSwapToDebtFormStore } from '../store/borrow-swap-to-debt-form.store';
