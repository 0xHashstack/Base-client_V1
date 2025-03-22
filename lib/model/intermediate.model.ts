import { Web3Address } from '@/types/web3';
import intermediateAbi from '@abi/intermediate.abi.json';
import { Abi } from 'viem';
import { UseReadContractParameters } from 'wagmi';

/**
 * Model class for interacting with the Intermediate contract
 */
class IntermediateModel {
	private readonly address: Web3Address;

	/**
	 * Creates a new IntermediateModel instance
	 * @param address - The address of the Intermediate contract
	 */
	constructor(address: Web3Address) {
		this.address = address;
	}

	/**
	 * Returns the contract configuration for a specific function call
	 * @param functionName - The name of the function to call
	 * @returns The contract configuration object
	 */
	getContractConfig(
		functionName: string,
		args?: UseReadContractParameters['args']
	) {
		return {
			abi: intermediateAbi as Abi,
			address: this.address,
			functionName,
			args,
		} as UseReadContractParameters;
	}

	/**
	 * Returns the address of the Intermediate contract
	 */
	getAddress(): Web3Address {
		return this.address;
	}
}

export default IntermediateModel;
