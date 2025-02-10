import {
	BASE_MAINNET_RPC_URL,
	BASE_SEPOLIA_RPC_URL,
	WALLET_CONNECT_PROJECT_ID,
} from '@/constant/config';
import { ChainNetwork } from '@/types/web3';
import { http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

interface Web3Config {
	rpcURL: string;
	chain: typeof base | typeof baseSepolia;
	transport: ReturnType<typeof http>;
	walletConnectProjectId: string;
}

/**
 * Web3DataProvider - Centralized provider for Web3 configuration
 */
class Web3DataProvider {
	private readonly currentNetwork: ChainNetwork;
	private readonly config: Web3Config;

	/**
	 * Creates an instance of Web3DataProvider
	 * @param currentNetwork - The current network to use (MAINNET or TESTNET)
	 */
	constructor(currentNetwork: ChainNetwork) {
		this.currentNetwork = currentNetwork;
		this.config = this.initializeConfig();
	}

	/**
	 * Initialize the Web3 configuration
	 * @returns Web3Config object
	 */
	private initializeConfig(): Web3Config {
		const isMainnet = this.currentNetwork === ChainNetwork.MAINNET;

		const rpcURL = isMainnet ? BASE_MAINNET_RPC_URL : BASE_SEPOLIA_RPC_URL;
		if (!rpcURL) {
			throw new Error(
				`RPC URL not configured for ${this.currentNetwork}`
			);
		}

		return {
			rpcURL,
			chain: isMainnet ? base : baseSepolia,
			transport: http(rpcURL),
			walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
		};
	}

	/**
	 * Check if current network is mainnet
	 */
	get isMainnet(): boolean {
		return this.currentNetwork === ChainNetwork.MAINNET;
	}

	/**
	 * Get the RPC URL for the current network
	 */
	get rpcURL(): string {
		return this.config.rpcURL;
	}

	/**
	 * Get the base chain configuration
	 */
	get baseChain(): typeof base | typeof baseSepolia {
		return this.config.chain;
	}

	/**
	 * Get the transport configuration
	 */
	get baseTransport(): ReturnType<typeof http> {
		return this.config.transport;
	}

	/**
	 * Get the WalletConnect project ID
	 */
	get walletConnectProjectId(): string {
		return this.config.walletConnectProjectId;
	}
}

export default Web3DataProvider;
