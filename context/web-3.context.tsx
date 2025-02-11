'use client';
import { web3Config } from '@/constant/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookieToInitialState, WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { customRainbowKitTheme } from '@/constant/theme/rainbowkit.theme';

export const queryClient = new QueryClient();

export const Web3Provider = ({
	children,
	cookie,
}: {
	children: React.ReactNode;
	cookie?: string | null;
}) => {
	const initialState = cookieToInitialState(web3Config, cookie);

	return (
		<WagmiProvider
			config={web3Config}
			initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider theme={customRainbowKitTheme}>
					{children}
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};
