'use client';
import { base, baseSepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';

import { IS_MAINNET, WALLET_CONNECT_PROJECT_ID } from './env.constant';
import { getDefaultConfig } from 'connectkit';

declare module 'wagmi' {
	interface Register {
		config: typeof web3Config;
	}
}

const chain = IS_MAINNET ? base : baseSepolia;

export const web3Config = createConfig(
	getDefaultConfig({
		chains: [chain],
		transports: {
			[base.id]: http(),
			[baseSepolia.id]: http(),
		},
		appName: 'HSTK-Base',
		walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
	})
);
