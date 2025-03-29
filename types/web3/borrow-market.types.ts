/**
 * Types for the borrow market data returned by the intermediate contract
 */

import { Web3Address } from './web3-core.types';

/**
 * Asset information
 */
export interface BorrowAsset {
	/** Contract address of the asset */
	address_: Web3Address;
	/** Name of the asset */
	name: string;
	/** URL to the asset's logo */
	logoURI: string;
	/** Number of decimals for the asset */
	decimals: number;
	/** Price in USD as a bigint */
	priceUSD: bigint;
	/** Symbol of the asset */
	symbol: string;
}

/**
 * User loan information
 */
export interface UserLoan {
	/** Loan ID */
	loanId: string;
	/** Borrower address */
	borrower: Web3Address;
	/** Borrow market address */
	borrowMarket: Web3Address;
	/** Borrowed amount as a bigint */
	amount: bigint;
	/** Current market address */
	currentMarket: Web3Address;
	/** Current amount as a bigint */
	currentAmount: bigint;
	/** Loan state */
	state: number;
	/** L3 integration address */
	l3Integration: Web3Address;
	/** L3 category */
	l3Category: number;
	/** Created timestamp */
	createdAt: string;
	/** Fee amount as a bigint */
	feeAmount: bigint;
}

/**
 * Market loan data for a specific market
 */
export interface MarketLoan {
	/** Contract address of the market */
	address_: Web3Address;
	/** Asset information */
	asset: BorrowAsset;
	/** Total borrowed as a bigint */
	totalBorrowed: bigint;
	/** Total debt as a bigint */
	totalDebt: bigint;
	/** Utilization rate as a bigint */
	utilizationRate: bigint;
	/** Borrow APR as a bigint */
	borrowApr: bigint;
	/** Available to borrow as a bigint */
	availableToBorrow: bigint;
	/** User's loan information */
	userLoan: UserLoan;
}

/**
 * Complete user borrow data
 */
export interface UserBorrowData {
	/** Array of market loans */
	marketLoans: MarketLoan[];
	/** Total borrowed value in USD as a bigint */
	totalBorrowedValueUsd: bigint;
	/** Total collateral value in USD as a bigint */
	totalCollateralValueUsd: bigint;
	/** Weighted borrow APR as a bigint */
	weightedBorrowApr: bigint;
}

/**
 * Borrow market quick overview data
 */
export interface BorrowMarketQuickOverview {
	/** Market borrow APR as a bigint */
	avgBorrowApr: bigint;
	/** Market utilization as a bigint */
	avgUtilization: bigint;
	/** Total debt amount as a bigint */
	totalDebt: bigint;
}

/**
 * User borrow quick overview data
 */
export interface UserBorrowQuickOverview {
	/** Total borrowed value in USD as a bigint */
	totalBorrowedValueUsd: bigint;
	/** Weighted borrow APR as a bigint */
	weightedBorrowApr: bigint;
}

/**
 * Simplified token type for UI display
 */
export interface BorrowMarketToken {
	/** Name of the asset */
	name: string;
	/** Symbol of the asset */
	symbol: string;
	/** Contract address of the asset */
	address: string;
	/** Number of decimals for the asset */
	decimals: number;
	/** URL to the asset's logo */
	iconUrl: string;
	/** Price in USD as a bigint */
	priceUSD?: bigint;
	/** Utilization rate as a bigint */
	utilizationRate?: bigint;
	/** Borrow APR as a bigint */
	borrowApr?: bigint;
	/** Available to borrow as a bigint */
	availableToBorrow?: bigint;
	/** Total borrowed as a bigint */
	totalBorrowed?: bigint;
}

/**
 * Borrow Collateral Type
 */
export interface BorrowMarketCollateral {
	/** Contract address of the collateral */
	address: string;
	/** Name of the collateral */
	name: string;
	/** Symbol of the collateral */
	symbol: string;
	/** Number of decimals for the collateral */
	decimals: number;
	/** URL to the collateral's logo */
	logoURI: string;
	/** isRToken */
	isRToken: boolean;
}
