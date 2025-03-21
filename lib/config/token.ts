import { Web3Address } from '@/types/web3';
import { Config } from 'wagmi';
import { readContracts } from '@wagmi/core';
import erc20ABI from '@abi/erc_20.abi.json';
import { Abi } from 'viem';
import { FaucetToken } from '@/store/useFaucetStore';

/**
 * TokenUtil - Utility class for fetching token information using wagmi
 */
class TokenUtil {
	private config: Config;

	/**
	 * Creates an instance of TokenUtil
	 * @param config - The wagmi configuration
	 */
	constructor(config: Config) {
		this.config = config;
	}

	/**
	 * Fetch token data for multiple addresses in parallel
	 * @param addresses - Array of token contract addresses
	 * @returns Promise resolving to array of FaucetToken objects
	 */
	async getMultipleTokenNames(
		addresses: Web3Address[]
	): Promise<FaucetToken[]> {
		try {
			const contracts = addresses.map((address) => ({
				address,
				abi: erc20ABI as Abi,
				functionName: 'name',
			}));
			// Create an array of promises for each token address
			const result = await readContracts(this.config, { contracts });

			// Wait for all promises to resolve
			return result.map((r, i) => ({
				name: r.result as string,
				address: addresses[i],
			}));
		} catch (error) {
			console.error('Error fetching multiple tokens data:', error);
			throw error;
		}
	}
}

export default TokenUtil;
