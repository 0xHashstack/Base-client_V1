import { web3DataProvider } from '@/constant/config';
import { HstkToken, SuppliedToken } from '@/types/web3/token.types';
import { create } from 'zustand';

/**
 * State shape
 */
interface TokenState {
	tokens: HstkToken[];
	tokensMap: Record<string, HstkToken>;
	suppliedTokens: SuppliedToken[];
	suppliedTokensMap: Record<string, SuppliedToken>;
	setSuppliedTokens: (tokens: SuppliedToken[]) => void;
}

/**
 * Static state
 * Initialize with tokens and create a map of tokens by address
 */
const staticState: TokenState = (() => {
	const tokens = web3DataProvider.tokens();
	return {
		tokens,
		tokensMap: tokens.reduce(
			(map, token) => {
				map[token.address] = token;
				return map;
			},
			{} as Record<string, HstkToken>
		),
		suppliedTokens: web3DataProvider.tokens(),
		suppliedTokensMap: {},
		setSuppliedTokens: () => {},
	};
})();

/**
 * Token store
 * Create a store with the static state
 */
export const useTokenStore = create<TokenState>((set) => ({
	...staticState,
	setSuppliedTokens: (tokens) => {
		set({
			suppliedTokens: tokens,
			suppliedTokensMap: tokens.reduce(
				(map, token) => {
					map[token.address] = token;
					return map;
				},
				{} as Record<string, HstkToken>
			),
		});
	},
}));
