import { web3DataProvider } from '@/constant/config';
import {
	CollateralToken,
	HstkToken,
	SuppliedToken,
} from '@/types/web3/token.types';
import { create } from 'zustand';

/**
 * State shape
 */
interface TokenState {
	tokens: HstkToken[];
	tokensMap: Record<string, HstkToken>;
	suppliedTokens: SuppliedToken[];
	suppliedTokensMap: Record<string, SuppliedToken>;
	collateralTokens: CollateralToken[];
	collateralTokensMap: Record<string, CollateralToken>;
	borrowMarketTokens: HstkToken[];
	borrowMarketTokensMap: Record<string, HstkToken>;
	borrowTokens: HstkToken[];
	borrowTokensMap: Record<string, HstkToken>;
	setSuppliedTokens: (tokens: SuppliedToken[]) => void;
	setCollateralTokens: (tokens: CollateralToken[]) => void;
	setBorrowMarketTokens: (tokens: HstkToken[]) => void;
	setBorrowTokens: (tokens: HstkToken[]) => void;
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
		collateralTokens: web3DataProvider.tokens(),
		collateralTokensMap: {},
		borrowMarketTokens: web3DataProvider.tokens(),
		borrowMarketTokensMap: {},
		borrowTokens: web3DataProvider.tokens(),
		borrowTokensMap: {},
		setSuppliedTokens: () => {},
		setCollateralTokens: () => {},
		setBorrowMarketTokens: () => {},
		setBorrowTokens: () => {},
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
	setCollateralTokens: (tokens) => {
		set({
			collateralTokens: tokens,
			collateralTokensMap: tokens.reduce(
				(map, token) => {
					map[token.address] = token;
					return map;
				},
				{} as Record<string, CollateralToken>
			),
		});
	},
	setBorrowMarketTokens: (tokens) => {
		set({
			borrowMarketTokens: tokens,
			borrowMarketTokensMap: tokens.reduce(
				(map, token) => {
					map[token.address] = token;
					return map;
				},
				{} as Record<string, HstkToken>
			),
		});
	},
	setBorrowTokens: (tokens) => {
		set({
			borrowTokens: tokens,
			borrowTokensMap: tokens.reduce(
				(map, token) => {
					map[token.address] = token;
					return map;
				},
				{} as Record<string, HstkToken>
			),
		});
	},
}));
