'use client';
import { base, baseSepolia } from 'viem/chains';
import { IS_MAINNET, WALLET_CONNECT_PROJECT_ID } from './env.constant';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

declare module 'wagmi' {
	interface Register {
		config: typeof web3Config;
	}
}

const chain = IS_MAINNET ? base : baseSepolia;

export const web3Config = getDefaultConfig({
	appName: 'HSTK Base',
	projectId: WALLET_CONNECT_PROJECT_ID,
	chains: [chain],
	ssr: true,
});
