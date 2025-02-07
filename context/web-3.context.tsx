'use client';

import { wagmiAdapter, WALLET_CONNECT_PROJECT_ID } from '@/constant/config';
import { createAppKit } from '@reown/appkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from '@reown/appkit/networks';
import { Config, cookieToInitialState, WagmiProvider } from 'wagmi';

export const queryClient = new QueryClient();

// Set up metadata
const metadata = {
	name: 'appkit-example',
	description: 'AppKit Example',
	url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
	icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId: WALLET_CONNECT_PROJECT_ID,
	networks: [base, baseSepolia],
	defaultNetwork: base,
	metadata: metadata,
	features: {
		email: false,
		socials: false,
		analytics: true, // Optional - defaults to your Cloud configuration
	},
});

export const Web3Provider = ({
	children,
	cookies,
}: {
	children: React.ReactNode;
	cookies: string | null;
}) => {
	const initialState = cookieToInitialState(
		wagmiAdapter.wagmiConfig as Config,
		cookies
	);
	return (
		<WagmiProvider
			config={wagmiAdapter.wagmiConfig as Config}
			initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
};
