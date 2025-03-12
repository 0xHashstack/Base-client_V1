import React, { createContext, useContext } from 'react';
import { useWalletTokenBalances } from '@/hooks/useWalletTokenBalance';
import { useTokenStore } from '@/store/useTokenStore';
import { HstkToken, SuppliedToken } from '@/types/web3/token.types';

interface EarnContextType {
	tokens: HstkToken[];
	suppliedTokens: SuppliedToken[];
	tokenBalances: {
		formatted: Record<string, string>;
		isLoading: boolean;
		isError: boolean;
		error: Error | null;
	};
}

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({ children }: { children: React.ReactNode }) {
	// Use individual selectors to avoid infinite loop
	const tokens = useTokenStore((state) => state.tokens);
	const suppliedTokens = useTokenStore((state) => state.suppliedTokens);

	const { formatted, isLoading, isError, error } = useWalletTokenBalances(
		tokens.map((token) => token.address)
	);

	const value = {
		tokens,
		suppliedTokens,
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
