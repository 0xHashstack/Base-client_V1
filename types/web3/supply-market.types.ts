/**
 * Types for the supply market data returned by the intermediate contract
 */

import { Web3Address } from './web3-core.types';

/**
 * Asset information
 */
export interface AssetInfo {
	/** Contract address of the asset */
	address_: Web3Address;
	/** Name of the asset */
	name: string;
	/** URL to the asset's logo */
	logoURI: string;
	/** Number of decimals for the asset */
	decimals: number;
	/** Price in USD as a bigint*/
	priceUSD: bigint;
	/** Symbol of the asset */
	symbol: string;
}

/**
 * Supply state data for a market
 */
export interface SupplyStateData {
	/** Total supply as a bigint */
	totalSupply: bigint;
	/** Total assets as a bigint */
	totalAssets: bigint;
	/** Total assets value in USD as a bigint */
	totalAssetsUsd: bigint;
	/** Annual APY as a bigint  */
	annualApy: bigint;
}

/**
 * Supply market data for a specific market
 */
export interface SupplyMarketData {
	/** Contract address of the market */
	address_: Web3Address;
	/** Asset information */
	asset: AssetInfo;
	/** Market state data */
	state: SupplyStateData;
	/** User's wallet balance as a bigint */
	walletBalance: bigint;
	/** User's asset value in the market as a bigint */
	userAssetValue: bigint;
}

/**
 * Supply position data for a user
 */
export interface SupplyPosition {
	/** Supply asset information */
	supplyAsset: AssetInfo;
	/** Underlying asset information */
	underlyingAsset: AssetInfo;
	/** Amount supplied as a bigint */
	suppliedAmount: bigint;
	/** Market value as a bigint */
	marketValue: bigint;
	/** Receipt tokens as a bigint */
	receiptTokens: bigint;
	/** Exchange rate as a bigint */
	exchangeRate: bigint;
	/** Yield rate as a bigint */
	yieldRate: bigint;
	/** Effective yield as a bigint */
	effectiveYield: bigint;
}

/**
 * Complete user supply data
 */
export interface UserSupplyData {
	/** Array of supply market data */
	markets: SupplyMarketData[];
	/** Total supplied value in USD as a bigint */
	totalSuppliedValueUsd: bigint;
	/** Weighted net APY as a bigint */
	weightedNetApy: bigint;
	/** Array of user's supply positions */
	supplyPositions: SupplyPosition[];
}

/**
 * Supply market quick overview data
 */
export interface SupplyMarketQuickOverview {
	/** Total deposit as a bigint */
	marketApr: bigint;
	/** Average APR as a bigint */
	marketDeposit: bigint;
}
