import { web3DataProvider } from '@/constant/config';
import { HstkCoin } from '@/types/web3/coin.types';
import { create } from 'zustand';

interface EarnState {
	coins: HstkCoin[];
}

export const useEarnStore = create<EarnState>()(() => ({
	coins: web3DataProvider.coins(),
}));
