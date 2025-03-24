import {
	CollateralToken,
	HstkToken,
	SuppliedToken,
} from '@/types/web3/token.types';
import {
	SupplyMarketData,
	SupplyMarketQuickOverview,
	SupplyPosition,
	UserSupplyData,
	UserSupplyQuickOverview,
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
	userSupplyQuickOverview: UserSupplyQuickOverview;
	supplyMarketQuickOverview: SupplyMarketQuickOverview;

	// Loading states
	isLoadingSupplyMarket: boolean;
	isLoadingBorrowMarket: boolean;
	isLoadingSupplyMarketOverview: boolean;

	// Actions
	setSuppliedTokens: (tokens: SuppliedToken[]) => void;
	setCollateralTokens: (tokens: CollateralToken[]) => void;
	setBorrowMarketTokens: (tokens: HstkToken[]) => void;
	setBorrowTokens: (tokens: HstkToken[]) => void;
	setSupplyMarketData: (data: UserSupplyData) => void;
	setSupplyMarketLoading: (isLoading: boolean) => void;
	setBorrowMarketLoading: (isLoading: boolean) => void;
	setSupplyMarketOverview: (data: SupplyMarketQuickOverview) => void;
	setSupplyMarketOverviewLoading: (isLoading: boolean) => void;
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
		userSupplyQuickOverview: {
			weightedNetApy: BigInt(0),
			totalSuppliedValueUsd: BigInt(0),
		},
		supplyMarketQuickOverview: {
			marketApr: BigInt(0),
			marketDeposit: BigInt(0),
		},
		// Loading states
		isLoadingSupplyMarket: true,
		isLoadingBorrowMarket: true,
		isLoadingSupplyMarketOverview: true,

		// Actions
		setSuppliedTokens: () => {},
		setCollateralTokens: () => {},
		setBorrowMarketTokens: () => {},
		setBorrowTokens: () => {},
		setSupplyMarketData: () => {},
		setSupplyMarketLoading: () => {},
		setBorrowMarketLoading: () => {},
		setSupplyMarketOverview: () => {},
		setSupplyMarketOverviewLoading: () => {},
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
			userSupplyQuickOverview: {
				weightedNetApy: data.weightedNetApy,
				totalSuppliedValueUsd: data.totalSuppliedValueUsd,
			},
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

	// Set market overview data
	setSupplyMarketOverview: (data: SupplyMarketQuickOverview) => {
		set({
			supplyMarketQuickOverview: data,
			isLoadingSupplyMarketOverview: false,
		});
	},

	// Set market overview loading state
	setSupplyMarketOverviewLoading: (isLoading: boolean) => {
		set({ isLoadingSupplyMarketOverview: isLoading });
	},

	// Reset market data
	resetMarketData: () => {
		set({
			supplyMarketData: [],
			userSupplyPositions: [],
			userSupplyQuickOverview: {
				weightedNetApy: BigInt(0),
				totalSuppliedValueUsd: BigInt(0),
			},
			supplyMarketQuickOverview: {
				marketApr: BigInt(0),
				marketDeposit: BigInt(0),
			},
			isLoadingSupplyMarket: false,
			isLoadingBorrowMarket: false,
			isLoadingSupplyMarketOverview: false,
		});
	},
}));
