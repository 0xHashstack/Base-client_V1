import React, { createContext, useContext } from 'react';
import { useWalletTokenBalances } from '@/hooks/useWalletTokenBalance';
import { useEarnStore } from '@/store/useEarn.store';
import { HstkCoin } from '@/types/web3/coin.types';

interface EarnContextType {
	coins: HstkCoin[];
	tokenBalances: {
		formatted: Record<string, string>;
		isLoading: boolean;
		isError: boolean;
		error: Error | null;
	};
}

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({ children }: { children: React.ReactNode }) {
	const { coins } = useEarnStore();
	const { formatted, isLoading, isError, error } = useWalletTokenBalances(
		coins.map((coin) => coin.address)
	);

	const value = {
		coins,
		tokenBalances: {
			formatted,
			isLoading,
			isError,
			error,
		},
	};

	return (
		<EarnContext.Provider value={value}>{children}</EarnContext.Provider>
	);
}

export function useEarnContext() {
	const context = useContext(EarnContext);
	if (context === undefined) {
		throw new Error('useEarnContext must be used within an EarnProvider');
	}
	return context;
}
