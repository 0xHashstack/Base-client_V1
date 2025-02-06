import { ChainNetwork } from '@/types/web3';

export const CURRENT_NETWORK =
	process.env.NEXT_PUBLIC_CHAIN_NETWORK || ChainNetwork.TESTNET;
export const IS_MAINNET = CURRENT_NETWORK === ChainNetwork.MAINNET;
export const WALLET_CONNECT_PROJECT_ID =
	process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
