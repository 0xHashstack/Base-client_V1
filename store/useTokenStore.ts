import { CollateralToken, HstkToken } from '@/types/web3/token.types';
import {
	SupplyMarketData,
	SupplyMarketQuickOverview,
	SupplyPosition,
	UserSupplyData,
	UserSupplyQuickOverview,
} from '@/types/web3/supply-market.types';
import { CurrentDebt } from '@/types/web3/borrow.types';
import { create } from 'zustand';

/**
 * State shape
 */
interface TokenState {
	// Supply market data
	supplyMarketData: SupplyMarketData[];
	userSupplyPositions: SupplyPosition[];
	userSupplyQuickOverview: UserSupplyQuickOverview;
	supplyMarketQuickOverview: SupplyMarketQuickOverview;

	// Borrow market data
	borrowMarketData: HstkToken[];
	userBorrowPositions: CurrentDebt[];
	userBorrowQuickOverview: {
		totalBorrowedValueUsd: bigint;
		weightedBorrowApr: bigint;
	};
	borrowMarketQuickOverview: {
		marketBorrowApr: bigint;
		marketBorrowedAmount: bigint;
	};

	// Token data
	collateralTokens: CollateralToken[];
	collateralTokensMap: Record<string, CollateralToken>;
	borrowMarketTokens: HstkToken[];
	borrowMarketTokensMap: Record<string, HstkToken>;
	borrowTokens: HstkToken[];
	borrowTokensMap: Record<string, HstkToken>;

	// Loading states
	isLoadingSupplyMarket: boolean;
	isLoadingBorrowMarket: boolean;
	isLoadingSupplyMarketOverview: boolean;
	isLoadingBorrowMarketOverview: boolean;

	// Actions
	setCollateralTokens: (tokens: CollateralToken[]) => void;
	setBorrowMarketTokens: (tokens: HstkToken[]) => void;
	setBorrowTokens: (tokens: HstkToken[]) => void;
	setSupplyMarketData: (data: UserSupplyData) => void;
	setSupplyMarketLoading: (isLoading: boolean) => void;
	setBorrowMarketLoading: (isLoading: boolean) => void;
	setSupplyMarketOverview: (data: SupplyMarketQuickOverview) => void;
	setSupplyMarketOverviewLoading: (isLoading: boolean) => void;
	setBorrowMarketData: (data: { markets: HstkToken[], borrowPositions: CurrentDebt[], totalBorrowedValueUsd: bigint, weightedBorrowApr: bigint }) => void;
	setBorrowMarketOverview: (data: { marketBorrowApr: bigint, marketBorrowedAmount: bigint }) => void;
	setBorrowMarketOverviewLoading: (isLoading: boolean) => void;
	resetMarketData: () => void;
}

/**
 * Static state
 * Initialize with tokens and create a map of tokens by address
 */
const staticState: TokenState = (() => {
	return {
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
		// Borrow market data
		borrowMarketData: [],
		userBorrowPositions: [],
		userBorrowQuickOverview: {
			totalBorrowedValueUsd: BigInt(0),
			weightedBorrowApr: BigInt(0),
		},
		borrowMarketQuickOverview: {
			marketBorrowApr: BigInt(0),
			marketBorrowedAmount: BigInt(0),
		},
		// Token data
		collateralTokens: [],
		collateralTokensMap: {},
		borrowMarketTokens: [],
		borrowMarketTokensMap: {},
		borrowTokens: [],
		borrowTokensMap: {},

		// Loading states
		isLoadingSupplyMarket: true,
		isLoadingBorrowMarket: true,
		isLoadingSupplyMarketOverview: true,
		isLoadingBorrowMarketOverview: true,

		// Actions
		setCollateralTokens: () => {},
		setBorrowMarketTokens: () => {},
		setBorrowTokens: () => {},
		setSupplyMarketData: () => {},
		setSupplyMarketLoading: () => {},
		setBorrowMarketLoading: () => {},
		setSupplyMarketOverview: () => {},
		setSupplyMarketOverviewLoading: () => {},
		setBorrowMarketData: () => {},
		setBorrowMarketOverview: () => {},
		setBorrowMarketOverviewLoading: () => {},
		resetMarketData: () => {},
	};
})();

/**
 * Token store
 * Create a store with the static state
 */
export const useTokenStore = create<TokenState>((set) => ({
	...staticState,
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

	// Set borrow market data and update related fields
	setBorrowMarketData: (data) => {
		set({
			borrowMarketData: data.markets,
			userBorrowPositions: data.borrowPositions,
			userBorrowQuickOverview: {
				totalBorrowedValueUsd: data.totalBorrowedValueUsd,
				weightedBorrowApr: data.weightedBorrowApr,
			},
			isLoadingBorrowMarket: false,
		});
	},

	// Set borrow market overview data
	setBorrowMarketOverview: (data) => {
		set({
			borrowMarketQuickOverview: data,
			isLoadingBorrowMarketOverview: false,
		});
	},

	// Set borrow market overview loading state
	setBorrowMarketOverviewLoading: (isLoading) => {
		set({ isLoadingBorrowMarketOverview: isLoading });
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
			borrowMarketData: [],
			userBorrowPositions: [],
			userBorrowQuickOverview: {
				totalBorrowedValueUsd: BigInt(0),
				weightedBorrowApr: BigInt(0),
			},
			borrowMarketQuickOverview: {
				marketBorrowApr: BigInt(0),
				marketBorrowedAmount: BigInt(0),
			},
			isLoadingSupplyMarket: false,
			isLoadingBorrowMarket: false,
			isLoadingSupplyMarketOverview: false,
			isLoadingBorrowMarketOverview: false,
		});
	},
}));
