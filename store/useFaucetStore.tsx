import { Web3Address } from '@/types/web3';
import { create } from 'zustand';

export type FaucetToken = {
	name: string;
	address: Web3Address;
};

interface FaucetState {
	// Token data
	tokens: FaucetToken[];
	tokensMap: Record<string, FaucetToken>;
	tokensLoading: boolean;

	// Minting state
	mintingTokens: Record<string, boolean>;

	// Actions
	setTokens: (tokens: FaucetToken[]) => void;
	setTokensLoading: (loading: boolean) => void;
	setMintingToken: (tokenAddress: string, isMinting: boolean) => void;
	resetStore: () => void;
}

const initialState: Omit<
	FaucetState,
	'setTokens' | 'setTokensLoading' | 'setMintingToken' | 'resetStore'
> = {
	tokens: [],
	tokensMap: {},
	tokensLoading: true,
	mintingTokens: {},
};

export const useFaucetStore = create<FaucetState>((set) => ({
	...initialState,

	// Set tokens and create a map for easy access
	setTokens: (tokens: FaucetToken[]) =>
		set((state) => ({
			tokens,
			tokensMap: tokens.reduce(
				(map, token) => {
					map[token.address] = token;
					return map;
				},
				{} as Record<string, FaucetToken>
			),
			// Initialize minting state for new tokens
			mintingTokens: tokens.reduce(
				(map, token) => {
					map[token.address] =
						state.mintingTokens[token.address] || false;
					return map;
				},
				{} as Record<string, boolean>
			),
		})),

	// Set loading state
	setTokensLoading: (loading: boolean) => set({ tokensLoading: loading }),

	// Set minting state for a specific token
	setMintingToken: (tokenAddress: string, isMinting: boolean) =>
		set((state) => ({
			mintingTokens: {
				...state.mintingTokens,
				[tokenAddress]: isMinting,
			},
		})),

	// Reset the store to initial state
	resetStore: () => set(initialState),
}));
