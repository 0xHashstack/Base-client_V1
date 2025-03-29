import { CollateralToken, HstkToken } from '@/types/web3/token.types';
import {
	SupplyMarketData,
	SupplyMarketQuickOverview,
	SupplyPosition,
	UserSupplyData,
	UserSupplyQuickOverview,
} from '@/types/web3/supply-market.types';
import {
	UserLoan,
	BorrowMarketQuickOverview,
	UserBorrowQuickOverview,
	MarketLoan,
	UserBorrowData,
	BorrowMarketCollateral,
} from '@/types/web3/borrow-market.types';
import { create } from 'zustand';
import { transformToBorrowMarketCollateral } from '@/utils/web3/supply/supply-market.utils';

/**
 * State shape
 */
interface TokenState {
	// Supply market data
	supplyMarketData: SupplyMarketData[];
	userSupplyPositions: SupplyPosition[];
	userSupplyQuickOverview: UserSupplyQuickOverview;
	supplyMarketQuickOverview: SupplyMarketQuickOverview;
	borrowMarketCollateral: BorrowMarketCollateral[];

	// Borrow market data
	borrowMarketData: MarketLoan[];
	userBorrowPositions: UserLoan[];
	userBorrowQuickOverview: UserBorrowQuickOverview;
	borrowMarketQuickOverview: BorrowMarketQuickOverview;

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
	setSupplyMarketData: (data: UserSupplyData) => void;
	setSupplyMarketLoading: (isLoading: boolean) => void;
	setBorrowMarketLoading: (isLoading: boolean) => void;
	setSupplyMarketOverview: (data: SupplyMarketQuickOverview) => void;
	setSupplyMarketOverviewLoading: (isLoading: boolean) => void;
	setBorrowMarketData: (data: UserBorrowData) => void;
	setBorrowMarketOverview: (data: BorrowMarketQuickOverview) => void;
	setBorrowMarketOverviewLoading: (isLoading: boolean) => void;
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
		// Derived data
		borrowMarketCollateral: [],
		// Borrow market data
		borrowMarketData: [],
		userBorrowPositions: [],
		userBorrowQuickOverview: {
			totalBorrowedValueUsd: BigInt(0),
			weightedBorrowApr: BigInt(0),
		},
		borrowMarketQuickOverview: {
			avgBorrowApr: BigInt(0),
			avgUtilization: BigInt(0),
			totalDebt: BigInt(0),
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

	// Set supply market data and update related fields
	setSupplyMarketData: (data) => {
		const collateralTokens = transformToBorrowMarketCollateral(data);
		set({
			supplyMarketData: data.markets,
			userSupplyPositions: data.supplyPositions,
			userSupplyQuickOverview: {
				weightedNetApy: data.weightedNetApy,
				totalSuppliedValueUsd: data.totalSuppliedValueUsd,
			},
			borrowMarketCollateral: collateralTokens,
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
			borrowMarketData: data.marketLoans,
			userBorrowPositions: data.marketLoans.map(
				({ userLoan }) => userLoan
			),
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
}));
