import { SupportedChain } from '@/store/useWeb3.store';
import { ChainNetwork, Web3Address } from '@/types/web3';
import {
	BASE_MAINNET_TOKEN_ADDRESS_LIST,
	BASE_SEPOLIA_TOKEN_ADDRESS_LIST,
} from './token.constant';

export const CHAIN_TOKEN_MAP: Record<
	SupportedChain,
	Record<ChainNetwork, Web3Address[]>
> = {
	base: {
		[ChainNetwork.MAINNET]: BASE_MAINNET_TOKEN_ADDRESS_LIST,
		[ChainNetwork.TESTNET]: BASE_SEPOLIA_TOKEN_ADDRESS_LIST,
	},
};
