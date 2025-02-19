import React, { createContext, useContext } from 'react';
import { useWalletTokenBalances } from '@/hooks/useWalletTokenBalance';
import { useTokenStore } from '@/store/useTokenStore';
import { HstkToken } from '@/types/web3/token.types';
import { useMyDebtStore } from '@/store/useMyDebt.store';

interface BorrowContextType {
	tokens: HstkToken[];
	tokenBalances: {
		formatted: Record<string, string>;
		isLoading: boolean;
		isError: boolean;
		error: Error | null;
	};
	myDebtPositions: {
		tokenAddress: string;
		amount: string;
		healthFactor: number;
	}[];
}

const BorrowContext = createContext<BorrowContextType | undefined>(undefined);

export function BorrowProvider({ children }: { children: React.ReactNode }) {
	const { tokens } = useTokenStore();
	const { myDebtPositions } = useMyDebtStore();
	const { formatted, isLoading, isError, error } = useWalletTokenBalances(
		tokens.map((token) => token.address)
	);

	const value = {
		tokens,
		tokenBalances: {
			formatted,
			isLoading,
			isError,
			error,
		},
		myDebtPositions,
	};

	return (
		<BorrowContext.Provider value={value}>{children}</BorrowContext.Provider>
	);
}

export const useBorrowContext = () => {
	const context = useContext(BorrowContext);
	if (context === undefined) {
		throw new Error('useBorrowContext must be used within a BorrowProvider');
	}
	return context;
};
