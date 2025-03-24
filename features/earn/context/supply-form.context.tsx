'use client';
import React, { ReactNode } from 'react';
import { SupplyFormProvider } from '../store/supply-form.store';
import { SupplyMarketData } from '@/types/web3/supply-market.types';
import { WalletTokenProvider } from '@/context/wallet-token-provider';

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
	if (!market) return null;
	return (
		<SupplyFormProvider initialMarket={market}>
			<WalletTokenProvider tokenAddress={market.asset.address_}>
				{children}
			</WalletTokenProvider>
		</SupplyFormProvider>
	);
}

// Re-export the useSupplyFormStore for convenience
export { useSupplyFormStore } from '../store/supply-form.store';
