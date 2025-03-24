import diamondAbi from '@/web3/abi/diamond.abi.json';
import { Web3Address } from '@/types/web3';
import { Abi, parseUnits } from 'viem';

/**
 * Model for handling token supply operations
 */
export class SupplyTokenModel {
	/**
	 * The token address
	 */
	private address: Web3Address;

	/**
	 * The token decimals
	 */
	private decimals: number;

	/**
	 * Create a new SupplyTokenModel instance
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
	 * Get the parameters for a deposit transaction
	 * @param diamondAddress The address of the diamond contract
	 * @param amount The amount to deposit in human-readable format (e.g., "10.5")
	 * @param receiver The address that will receive the rShares
	 * @returns Parameters for useWriteContract
	 */
	getDepositParams({
		diamondAddress,
		amount,
		receiver,
	}: {
		diamondAddress: Web3Address;
		amount: string;
		receiver: Web3Address;
	}) {
		// Convert the amount from human-readable format to wei
		const amountInWei = this.convertToWei(amount);

		return {
			address: diamondAddress,
			abi: this.getDiamondAbi(),
			functionName: 'deposit',
			args: [this.address, amountInWei, receiver],
		};
	}
}
