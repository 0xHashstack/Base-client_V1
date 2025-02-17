import { SupportedChain } from '@/store/useWeb3.store';
import { ChainNetwork } from '@/types/web3';
import { HstkToken } from '@/types/web3/token.types';
import { BASE_MAINNET_TOKENS, BASE_SEPOLIA_TOKENS } from './token.constant';

export const CHAIN_TOKEN_MAP: Record<
	SupportedChain,
	Record<ChainNetwork, HstkToken[]>
> = {
	base: {
		[ChainNetwork.MAINNET]: BASE_MAINNET_TOKENS,
		[ChainNetwork.TESTNET]: BASE_SEPOLIA_TOKENS,
	},
};
