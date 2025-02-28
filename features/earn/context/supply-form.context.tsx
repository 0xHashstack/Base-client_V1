'use client';
import React, { ReactNode } from 'react';
import { SupplyFormProvider } from '../store/supply-form.store';

interface SupplyFormContextProviderProps {
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
export function SupplyFormContextProvider({
	children,
	token,
}: SupplyFormContextProviderProps) {
	return (
		<SupplyFormProvider initialToken={token}>
			{children}
		</SupplyFormProvider>
	);
}

// Re-export the useSupplyFormStore for convenience
export { useSupplyFormStore } from '../store/supply-form.store';
