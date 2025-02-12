import { SUPPORTED_CHAINS } from '@/constant/config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

interface Web3State {
	selectedChain: SupportedChain;
	setSelectedChain: (chain: SupportedChain) => void;
}

export const useWeb3Store = create<Web3State>()(
	persist(
		(set) => ({
			selectedChain: 'base',
			setSelectedChain: (chain) => set({ selectedChain: chain }),
		}),
		{
			name: 'hstk-web3-storage',
		}
	)
);
