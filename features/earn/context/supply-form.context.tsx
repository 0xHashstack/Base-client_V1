'use client';
import React, { ReactNode } from 'react';
import { SupplyFormProvider } from '../store/supply-form.store';
import { SupplyMarketData } from '@/types/web3/supply-market.types';

interface SupplyFormContextProviderProps {
	children: ReactNode;
	market: SupplyMarketData | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function SupplyFormContextProvider({
	children,
	market,
}: SupplyFormContextProviderProps) {
	return (
		<SupplyFormProvider initialMarket={market}>
			{children}
		</SupplyFormProvider>
	);
}

// Re-export the useSupplyFormStore for convenience
export { useSupplyFormStore } from '../store/supply-form.store';
