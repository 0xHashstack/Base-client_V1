'use client';
import React, { ReactNode } from 'react';
import { SupplyWithdrawFormProvider } from '../store/supply-withdraw-form.store';

interface SupplyWithdrawFormContextProviderProps {
	children: ReactNode;
	token: {
		name: string;
		symbol: string;
		address: string;
		iconUrl: string;
		decimals: number;
	} | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function SupplyWithdrawFormContextProvider({
	children,
	token,
}: SupplyWithdrawFormContextProviderProps) {
	return (
		<SupplyWithdrawFormProvider initialToken={token}>
			{children}
		</SupplyWithdrawFormProvider>
	);
}

// Re-export the useWithdrawFormStore for convenience
export { useSupplyWithdrawFormStore as useWithdrawFormStore } from '../store/supply-withdraw-form.store';
