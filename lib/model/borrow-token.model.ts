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

	/**
	 * Get the parameters for repaying a loan
	 * @param loanId The ID of the loan to repay
	 * @param repayAmount The amount to repay in human-readable format
	 * @returns Parameters for useWriteContract
	 */
	getRepayLoanParams({
		loanId,
		repayAmount,
		decimals,
	}: {
		loanId: bigint;
		repayAmount: string;
		decimals: number;
	}) {
		// Convert the amount from human-readable format to wei
		const repayAmountInWei = parseUnits(repayAmount, decimals);

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'repayLoan',
			args: [loanId, repayAmountInWei],
		};
	}

	/**
	 * Get the parameters for adding collateral to a loan
	 * @param loanId The ID of the loan to add collateral to
	 * @param collateralAsset The address of the collateral asset
	 * @param collateralAmount The amount of collateral in human-readable format
	 * @param collateralDecimals The decimals of the collateral asset
	 * @returns Parameters for useWriteContract
	 */
	getAddCollateralParams({
		loanId,
		collateralAsset,
		collateralAmount,
		collateralDecimals,
	}: {
		loanId: bigint;
		collateralAsset: Web3Address;
		collateralAmount: string;
		collateralDecimals: number;
	}) {
		// Convert the collateral amount based on its decimals
		const collateralAmountInWei = parseUnits(
			collateralAmount,
			collateralDecimals
		);

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'addCollateral',
			args: [loanId, collateralAsset, collateralAmountInWei],
		};
	}

	/**
	 * Get the parameters for adding rToken collateral to a loan
	 * @param loanId The ID of the loan to add collateral to
	 * @param rToken The address of the rToken to use as collateral
	 * @param rTokenAmount The amount of rToken in human-readable format
	 * @param rTokenDecimals The decimals of the rToken
	 * @returns Parameters for useWriteContract
	 */
	getAddRTokenCollateralParams({
		loanId,
		rToken,
		rTokenAmount,
		rTokenDecimals,
	}: {
		loanId: bigint;
		rToken: Web3Address;
		rTokenAmount: string;
		rTokenDecimals: number;
	}) {
		// Convert the rToken amount based on its decimals
		const rTokenAmountInWei = parseUnits(rTokenAmount, rTokenDecimals);

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'addRTokenCollateral',
			args: [loanId, rToken, rTokenAmountInWei],
		};
	}

	/**
	 * Get the parameters for adding collateral to a loan based on BorrowCollateral type
	 * @param loanId The ID of the loan to add collateral to
	 * @param collateral The collateral to add to the loan
	 * @param collateralAmount The amount of collateral to add in human-readable format
	 * @returns Parameters for useWriteContract
	 */
	getAddCollateralFromBorrowCollateral({
		loanId,
		collateral,
		collateralAmount,
	}: {
		loanId: bigint;
		collateral: BorrowMarketCollateral;
		collateralAmount: string;
	}) {
		if (collateral.isRToken) {
			return this.getAddRTokenCollateralParams({
				loanId,
				rToken: collateral.address,
				rTokenAmount: collateralAmount,
				rTokenDecimals: collateral.decimals,
			});
		}
		return this.getAddCollateralParams({
			loanId,
			collateralAsset: collateral.address,
			collateralAmount,
			collateralDecimals: collateral.decimals,
		});
	}

	/**
	 * Get the parameters for interacting with APY
	 * @param params The parameters for the interaction
	 * @returns Parameters for useWriteContract
	 */
	getInteractWithApyParams({
		loanId,
		dappId,
		action,
		isCrossChain,
		amountIn,
		minAmountOut,
		tokenIn,
		tokenOut,
		data,
		tokenInDecimals,
	}: {
		loanId: bigint;
		dappId: number;
		action: number;
		isCrossChain: boolean;
		amountIn: string;
		minAmountOut: string;
		tokenIn: Web3Address;
		tokenOut: Web3Address;
		data: string;
		tokenInDecimals: number;
	}) {
		// Convert the amounts based on token decimals
		const amountInWei = parseUnits(amountIn, tokenInDecimals);
		const minAmountOutWei = parseUnits(minAmountOut, tokenInDecimals);

		const spendParams = {
			loanId,
			dappId,
			action,
			isCrossChain,
			amount_in: amountInWei,
			min_amount_out: minAmountOutWei,
			token_in: tokenIn,
			token_out: tokenOut,
			data,
		};

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'interactWithApy',
			args: [spendParams],
		};
	}

	/**
	 * Get the parameters for reverting an interaction with APY
	 * @param params The parameters for the revert interaction
	 * @returns Parameters for useWriteContract
	 */
	getRevertInteractionWithApyParams({
		loanId,
		amount,
		tokenOut,
		dappAddress,
		dappId,
		actionType,
		tokenOutDecimals,
	}: {
		loanId: bigint;
		amount: string;
		tokenOut: Web3Address;
		dappAddress: Web3Address;
		dappId: number;
		actionType: number;
		tokenOutDecimals: number;
	}) {
		// Convert the amount based on token decimals
		const amountInWei = parseUnits(amount, tokenOutDecimals);

		const revertSpendParams = {
			loanId,
			amount: amountInWei,
			tokenOut,
			dappAddress,
			dappId,
			actionType,
		};

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'revertInteractionWithApy',
			args: [revertSpendParams],
		};
	}

	/**
	 * Get the parameters for swapping tokens to debt
	 * @param loanId The ID of the loan to swap to debt
	 * @param amount The amount to swap in human-readable format
	 * @param tokenAddress The address of the token to swap
	 * @param decimals The decimals of the token
	 * @returns Parameters for useWriteContract
	 */
	getSwapToDebtParams({
		loanId,
		amount,
		tokenAddress,
		decimals,
	}: {
		loanId: bigint;
		amount: string;
		tokenAddress: Web3Address;
		decimals: number;
	}) {
		// Convert the amount based on token decimals
		const amountInWei = parseUnits(amount, decimals);

		return {
			address: web3DataProvider.diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'swapToDebt',
			args: [loanId, tokenAddress, amountInWei],
		};
	}
}
