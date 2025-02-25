'use client';
import React, { createContext, useContext } from 'react';
import { useAccount } from 'wagmi';

const DappUserContext = createContext<{
	address?: `0x${string}`;
} | null>(null);

export const DappUserProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { address } = useAccount();
	return (
		<DappUserContext.Provider value={{ address }}>
			{children}
		</DappUserContext.Provider>
	);
};

export const useDappUser = () => {
	const context = useContext(DappUserContext);
	if (context === null) {
		throw new Error('useDappUser must be used within a UserProvider');
	}
	return context;
};
