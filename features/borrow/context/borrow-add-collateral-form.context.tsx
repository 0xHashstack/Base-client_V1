'use client';
import React, { ReactNode } from 'react';
import { BorrowAddCollateralFormProvider } from '../store/borrow-add-collateral-form.store';
import { CollateralToken } from '@/types/web3';

interface BorrowAddCollateralFormContextProviderProps {
	children: ReactNode;
	token: CollateralToken | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowAddCollateralFormContextProvider({
	children,
	token,
}: BorrowAddCollateralFormContextProviderProps) {
	return (
		<BorrowAddCollateralFormProvider initialToken={token}>
			{children}
		</BorrowAddCollateralFormProvider>
	);
}

// Re-export the useBorrowAddCollateralFormStore for convenience
export { useBorrowAddCollateralFormStore } from '../store/borrow-add-collateral-form.store';
