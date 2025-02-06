import { base, baseSepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import {
	coinbaseWallet,
	injected,
	metaMask,
	walletConnect,
} from 'wagmi/connectors';
import { IS_MAINNET, WALLET_CONNECT_PROJECT_ID } from './env.constant';

declare module 'wagmi' {
	interface Register {
		config: typeof web3Config;
	}
}

const chain = IS_MAINNET ? base : baseSepolia;

export const web3Config = createConfig({
	chains: [chain],
	transports: {
		[base.id]: http(),
		[baseSepolia.id]: http(),
	},
	connectors: [
		injected(),
		metaMask(),
		coinbaseWallet(),
		walletConnect({ projectId: WALLET_CONNECT_PROJECT_ID }),
	],
});
