import diamondAbi from '@/web3/abi/diamond.abi.json';
import { Web3Address } from '@/types/web3';
import { Abi, parseUnits } from 'viem';
import { BorrowMarketCollateral } from '@/types/web3/borrow-market.types';
import { web3DataProvider } from '@/constant/config';

/**
 * Model for handling token borrow operations
 */
export class BorrowTokenModel {
	/**
	 * The token address
	 */
	private address: Web3Address;

	/**
	 * The token decimals
	 */
	private decimals: number;

	/**
	 * Create a new BorrowTokenModel instance
	 * @param address The token address
	 * @param decimals The token decimals
	 */
	constructor(address: Web3Address, decimals: number) {
		this.address = address;
		this.decimals = decimals;
	}

	/**
	 * Get the full diamond ABI
	 * @returns The diamond contract ABI
	 */
	getDiamondAbi(): Abi {
		return diamondAbi as Abi;
	}

	/**
	 * Convert human-readable amount to wei based on token decimals
	 * @param amount The amount in human-readable format (e.g., "10.5")
	 * @returns The amount in wei as bigint
	 */
	convertToWei(amount: string): bigint {
		try {
			return parseUnits(amount, this.decimals);
		} catch (error) {
			console.error('Error converting amount to wei:', error);
			throw new Error(
				`Failed to convert ${amount} to wei with ${this.decimals} decimals`
			);
		}
	}

	/**
	 * Get the parameters for a loanRequest transaction
	 * @param diamondAddress The address of the diamond contract
	 * @param amount The amount to borrow in human-readable format
	 * @param collateralAsset The address of the collateral asset
	 * @param collateralAmount The amount of collateral in human-readable format
	 * @param recipient The address that will receive the borrowed tokens
	 * @param collateralDecimals The decimals of the collateral asset
	 * @returns Parameters for useWriteContract
	 */
	getLoanRequestParams({
		collateralAsset,
		collateralAmount,
		borrowAmount,
		recipient,
		collateralDecimals,
	}: {
		collateralAsset: Web3Address;
		collateralAmount: string;
		borrowAmount: string;
		recipient: Web3Address;
		collateralDecimals: number;
	}) {
		// Convert the amount from human-readable format to wei
		const borrowAmountInWei = this.convertToWei(borrowAmount);

		// Convert the collateral amount based on its decimals
		const collateralAmountInWei = parseUnits(
			collateralAmount,
			collateralDecimals
		);

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'loanRequest',
			args: [
				this.address,
				borrowAmountInWei,
				collateralAsset,
				collateralAmountInWei,
				recipient,
			],
		};
	}

	/**
	 * Get the parameters for a loanRequestWithRToken transaction
	 * @param amount The amount to borrow in human-readable format
	 * @param rToken The address of the rToken to use as collateral
	 * @param rTokenAmount The amount of rToken to use as collateral in human-readable format
	 * @param recipient The address that will receive the borrowed tokens
	 * @param rTokenDecimals The decimals of the rToken
	 * @returns Parameters for useWriteContract
	 */
	getLoanRequestWithRTokenParams({
		borrowAmount,
		rToken,
		rTokenAmount,
		recipient,
		rTokenDecimals,
	}: {
		borrowAmount: string;
		rToken: Web3Address;
		rTokenAmount: string;
		recipient: Web3Address;
		rTokenDecimals: number;
	}) {
		// Convert the amount from human-readable format to wei
		const borrowAmountInWei = this.convertToWei(borrowAmount);

		// Convert the rToken amount based on its decimals
		const rTokenAmountInWei = parseUnits(rTokenAmount, rTokenDecimals);

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'loanRequestWithRToken',
			args: [
				this.address,
				borrowAmountInWei,
				rToken,
				rTokenAmountInWei,
				recipient,
			],
		};
	}

	/**
	 * Get the parameters based on BorrowCollateral type
	 * @param collateral The collateral to use for the loan request
	 * @param collateralAmount The amount of collateral to use for the loan request
	 * @param borrowAmount The amount to borrow
	 * @param recipient The address that will receive the borrowed tokens
	 */
	getLoanRequestFromBorrowCollateral({
		collateral,
		collateralAmount,
		borrowAmount,
		recipient,
	}: {
		collateral: BorrowMarketCollateral;
		collateralAmount: string;
		borrowAmount: string;
		recipient: Web3Address;
	}) {
		if (collateral.isRToken) {
			return this.getLoanRequestWithRTokenParams({
				borrowAmount,
				rToken: collateral.address,
				rTokenAmount: collateralAmount,
				recipient,
				rTokenDecimals: collateral.decimals,
			});
		}
		return this.getLoanRequestParams({
			borrowAmount,
			collateralAsset: collateral.address,
			collateralAmount,
			recipient,
			collateralDecimals: collateral.decimals,
		});
	}
}
