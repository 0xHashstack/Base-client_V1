'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletTokenBalance } from '@/hooks/useWalletTokenBalance';
import { Web3Address } from '@/types/web3';

// Define the context type based on the return value of useWalletTokenBalance
type WalletTokenContextType = ReturnType<typeof useWalletTokenBalance>;

// Create the context
const WalletTokenContext = createContext<WalletTokenContextType | undefined>(
	undefined
);

// Props for the provider component
interface WalletTokenProviderProps {
	children: ReactNode;
	tokenAddress: Web3Address;
	decimals?: number;
	walletAddress?: Web3Address;
}

/**
 * Provider component that wraps parts of the app that need access to wallet token balance
 */
export function WalletTokenProvider({
	children,
	tokenAddress,
	decimals,
	walletAddress,
}: WalletTokenProviderProps) {
	// Use the hook to get token balance information
	const balanceInfo = useWalletTokenBalance(tokenAddress, {
		decimals,
		address: walletAddress,
	});

	return (
		<WalletTokenContext.Provider value={balanceInfo}>
			{children}
		</WalletTokenContext.Provider>
	);
}

/**
 * Hook to use the wallet token balance context
 * @returns WalletTokenContextType
 */
export function useWalletToken() {
	const context = useContext(WalletTokenContext);

	if (context === undefined) {
		throw new Error(
			'useWalletToken must be used within a WalletTokenProvider'
		);
	}

	return context;
}
