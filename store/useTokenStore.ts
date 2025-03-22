import {
	CollateralToken,
	HstkToken,
	SuppliedToken,
} from '@/types/web3/token.types';
import {
	SupplyMarketData,
	SupplyPosition,
	UserSupplyData,
} from '@/types/web3/supply-market.types';
import { create } from 'zustand';

/**
 * State shape
 */
interface TokenState {
	// Token data
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

	// Supply market data
	supplyMarketData: SupplyMarketData[];
	userSupplyPositions: SupplyPosition[];
	totalSuppliedValueUsd: bigint;
	weightedNetApy: bigint;

	// Loading states
	isLoadingSupplyMarket: boolean;
	isLoadingBorrowMarket: boolean;

	// Actions
	setSuppliedTokens: (tokens: SuppliedToken[]) => void;
	setCollateralTokens: (tokens: CollateralToken[]) => void;
	setBorrowMarketTokens: (tokens: HstkToken[]) => void;
	setBorrowTokens: (tokens: HstkToken[]) => void;
	setSupplyMarketData: (data: UserSupplyData) => void;
	setSupplyMarketLoading: (isLoading: boolean) => void;
	setBorrowMarketLoading: (isLoading: boolean) => void;
	resetMarketData: () => void;
}

/**
 * Static state
 * Initialize with tokens and create a map of tokens by address
 */
const staticState: TokenState = (() => {
	return {
		// Token data
		tokens: [],
		tokensMap: {},
		suppliedTokens: [],
		suppliedTokensMap: {},
		collateralTokens: [],
		collateralTokensMap: {},
		borrowMarketTokens: [],
		borrowMarketTokensMap: {},
		borrowTokens: [],
		borrowTokensMap: {},

		// Supply market data
		supplyMarketData: [],
		userSupplyPositions: [],
		totalSuppliedValueUsd: BigInt(0),
		weightedNetApy: BigInt(0),

		// Loading states
		isLoadingSupplyMarket: false,
		isLoadingBorrowMarket: false,

		// Actions
		setSuppliedTokens: () => {},
		setCollateralTokens: () => {},
		setBorrowMarketTokens: () => {},
		setBorrowTokens: () => {},
		setSupplyMarketData: () => {},
		setSupplyMarketLoading: () => {},
		setBorrowMarketLoading: () => {},
		resetMarketData: () => {},
	};
})();

/**
 * Token store
 * Create a store with the static state
 */
export const useTokenStore = create<TokenState>((set) => ({
	...staticState,
	// Set supplied tokens and update the map
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

	// Set supply market data and update related fields
	setSupplyMarketData: (data) => {
		set({
			supplyMarketData: data.markets,
			userSupplyPositions: data.supplyPositions,
			totalSuppliedValueUsd: data.totalSuppliedValueUsd,
			weightedNetApy: data.weightedNetApy,
			isLoadingSupplyMarket: false,
		});
	},

	// Set supply market loading state
	setSupplyMarketLoading: (isLoading) => {
		set({ isLoadingSupplyMarket: isLoading });
	},

	// Set borrow market loading state
	setBorrowMarketLoading: (isLoading) => {
		set({ isLoadingBorrowMarket: isLoading });
	},

	// Reset market data
	resetMarketData: () => {
		set({
			supplyMarketData: [],
			userSupplyPositions: [],
			totalSuppliedValueUsd: BigInt(0),
			weightedNetApy: BigInt(0),
			isLoadingSupplyMarket: false,
			isLoadingBorrowMarket: false,
		});
	},
}));
