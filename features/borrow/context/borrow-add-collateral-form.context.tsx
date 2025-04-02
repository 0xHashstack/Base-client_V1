'use client';
import React, { ReactNode } from 'react';
import { BorrowAddCollateralFormProvider } from '../store/borrow-add-collateral-form.store';
import { LoanPosition } from '@/types/web3/borrow-market.types';

interface BorrowAddCollateralFormContextProviderProps {
	children: ReactNode;
	loanPosition: LoanPosition | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowAddCollateralFormContextProvider({
	children,
	loanPosition,
}: BorrowAddCollateralFormContextProviderProps) {
	return (
		<BorrowAddCollateralFormProvider initialLoanPosition={loanPosition}>
			{children}
		</BorrowAddCollateralFormProvider>
	);
}
