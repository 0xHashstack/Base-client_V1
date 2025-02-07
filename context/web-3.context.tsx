'use client';

import { web3Config } from '@/constant/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
	darkTheme,
	midnightTheme,
	RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
	return (
		<WagmiProvider config={web3Config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider
					theme={midnightTheme({
						...midnightTheme.accentColors.pink,
						borderRadius: 'small',
						fontStack: 'system',
					})}>
					{children}
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};
