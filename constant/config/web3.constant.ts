import { base, baseSepolia } from '@reown/appkit/networks';
import { WALLET_CONNECT_PROJECT_ID } from './env.constant';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage } from '@wagmi/core';

declare module 'wagmi' {
	interface Register {
		config: typeof web3Config;
	}
}

export const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	projectId: WALLET_CONNECT_PROJECT_ID,
	networks: [base, baseSepolia],
});

export const web3Config = wagmiAdapter.wagmiConfig;
