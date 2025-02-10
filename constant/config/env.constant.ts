import { ChainNetwork } from '@/types/web3';

export const CURRENT_NETWORK = (process.env.NEXT_PUBLIC_CHAIN_NETWORK ||
	ChainNetwork.TESTNET) as ChainNetwork;
export const WALLET_CONNECT_PROJECT_ID =
	process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
export const BASE_SEPOLIA_RPC_URL =
	process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || '';
export const BASE_MAINNET_RPC_URL =
	process.env.NEXT_PUBLIC_BASE_MAINNET_RPC || '';
