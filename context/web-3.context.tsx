'use client';

import { web3Config } from '@/constant/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

export const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
	return (
		<WagmiProvider config={web3Config}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
};
