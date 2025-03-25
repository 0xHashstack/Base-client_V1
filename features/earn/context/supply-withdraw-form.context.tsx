'use client';
import React, { ReactNode } from 'react';
import { SupplyWithdrawFormProvider } from '../store/supply-withdraw-form.store';
import { SupplyPosition } from '@/types/web3/supply-market.types';

interface SupplyWithdrawFormContextProviderProps {
	children: ReactNode;
	position: SupplyPosition | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function SupplyWithdrawFormContextProvider({
	children,
	position,
}: SupplyWithdrawFormContextProviderProps) {
	return (
		<SupplyWithdrawFormProvider initialPosition={position}>
			{children}
		</SupplyWithdrawFormProvider>
	);
}

// Re-export the useWithdrawFormStore for convenience
export { useSupplyWithdrawFormStore as useWithdrawFormStore } from '../store/supply-withdraw-form.store';
