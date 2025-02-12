import { SupportedChain } from '@/store/useWeb3.store';
import { ChainNetwork } from '@/types/web3';
import { HstkCoin } from '@/types/web3/coin.types';
import { BASE_MAINNET_COINS, BASE_SEPOLIA_COINS } from './coin.constant';

export const CHAIN_COIN_MAP: Record<
	SupportedChain,
	Record<ChainNetwork, HstkCoin[]>
> = {
	base: {
		[ChainNetwork.MAINNET]: BASE_MAINNET_COINS,
		[ChainNetwork.TESTNET]: BASE_SEPOLIA_COINS,
	},
};
