import { Web3Address } from '@/types/web3';
import {
	useReadContract,
	useReadContracts,
	type UseReadContractsParameters,
} from 'wagmi';
import erc20ABI from '@/web3/abi/erc_20.abi.json';

import { formatTokenBalance } from '@/utils/web3';
import { useMemo } from 'react';
import { useDappUser } from '@/context/user-data.context';

// Types for wagmi contract results
type ContractResult = {
	error?: Error;
	result?: unknown;
	status: 'success' | 'failure';
};

interface TokenBalanceParams {
	decimals?: number;
	address?: Web3Address;
}

/**
 * Extract bigint value from contract result
 */
const extractValue = (result: ContractResult): bigint | undefined => {
	if (result.status === 'success' && result.result !== undefined) {
		return result.result as bigint;
	}
	return undefined;
};

/**
 * Hook to fetch and format token balance for a single token
 */
export const useWalletTokenBalance = (
	tokenAddress: Web3Address,
	{ decimals = 18, address }: TokenBalanceParams = {}
) => {
	const { address: walletAccount } = useDappUser();
	const wAccount = address ?? walletAccount;

	const { data, isError, isLoading, isSuccess, error, refetch, queryKey } =
		useReadContract({
			address: tokenAddress as Web3Address,
			abi: erc20ABI,
			functionName: 'balanceOf',
			args: [wAccount],
			query: {
				enabled: !!wAccount,
				refetchOnMount: true,
				refetchOnWindowFocus: true,
			},
		});

	return {
		data,
		formatted: formatTokenBalance(data as bigint, decimals),
		isError,
		isLoading,
		isSuccess,
		error,
		refetch,
		queryKey,
	};
};

/**
 * Hook to fetch and format token balances for multiple tokens
 */
export const useWalletTokenBalances = (
	tokenAddresses: string[],
	{ decimals = 18, address }: TokenBalanceParams = {}
) => {
	const { address: walletAccount } = useDappUser();
	const wAccount = address ?? walletAccount;

	const contracts = tokenAddresses.map((tokenAddress) => ({
		address: tokenAddress as Web3Address,
		abi: erc20ABI,
		functionName: 'balanceOf',
		args: [wAccount],
	})) as UseReadContractsParameters['contracts'];

	const { data, isError, isLoading, isSuccess, error, refetch, queryKey } =
		useReadContracts({
			contracts,
			allowFailure: true,
			query: {
				enabled: !!wAccount,
			},
		});

	const values = useMemo(
		() =>
			data?.reduce(
				(acc, result, index) => {
					acc[tokenAddresses[index]] = extractValue(
						result as ContractResult
					);
					return acc;
				},
				{} as Record<string, bigint | undefined>
			) || {},
		[data, tokenAddresses]
	);

	const formattedValues = useMemo(
		() =>
			Object.entries(values).reduce(
				(acc, [address, value]) => {
					acc[address] = formatTokenBalance(value, decimals);
					return acc;
				},
				{} as Record<string, string>
			),
		[values, decimals]
	);

	return {
		data: values,
		formatted: formattedValues,
		isError,
		isLoading,
		isSuccess,
		error,
		refetch,
		queryKey,
	};
};
