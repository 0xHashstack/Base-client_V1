import React, { useEffect } from 'react';

import { useReadContract } from 'wagmi';
import {
	intermediateContract,
	web3DataProvider,
} from '@/constant/config/web3-config.constant';
import { useTokenStore } from '@/store/useTokenStore';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';
import {
	SupplyMarketQuickOverview,
	UserSupplyData,
} from '@/types/web3/supply-market.types';
import { useDappUser } from '@/context/user-data.context';
import { FALLBACK_USER_ADDRESS } from '@/constant/web3';

/**
 * A wrapper component for the Earn view that fetches data for the EarnTable and EarnCardStack
 * using the useReadContract hook from wagmi
 */
const EarnDataFetcher: React.FC = () => {
	const { address = FALLBACK_USER_ADDRESS } = useDappUser();

	// Get token store actions
	const {
		setSupplyMarketData,
		setSupplyMarketLoading,
		setSupplyMarketOverview: setMarketOverview,
		setSupplyMarketOverviewLoading: setMarketOverviewLoading,
	} = useTokenStore();

	// Get query key store actions
	const setSupplyMarketDataQueryKey = useQueryKeyStore(
		(state) => state.setSupplyMarketDataQueryKey
	);
	const setSupplyMarketOverviewQueryKey = useQueryKeyStore(
		(state) => state.setSupplyMarketOverviewQueryKey
	);

	// Call getUserSupplyMarketData from the intermediate contract
	const {
		data: supplyMarketData,
		isLoading: isLoadingSupplyMarket,
		isError: isSupplyMarketError,
		refetch: refetchSupplyMarket,
		queryKey,
	} = useReadContract({
		...intermediateContract.getContractConfig('getUserSupplyMarketData', [
			web3DataProvider.tokens(),
			address,
		]),
		query: {
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	});

	// Call getSupplyMarketOverview from the intermediate contract
	const {
		data: marketOverviewData,
		isLoading: isLoadingMarketOverview,
		isError: isMarketOverviewError,
		refetch: refetchMarketOverview,
		queryKey: marketQueryKey,
	} = useReadContract({
		...intermediateContract.getContractConfig(
			'getSupplyMarketOverview',
			[]
		),
		query: {
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	});

	// Update loading states when fetching starts
	useEffect(() => {
		setSupplyMarketLoading(isLoadingSupplyMarket);
	}, [isLoadingSupplyMarket, setSupplyMarketLoading]);

	useEffect(() => {
		setMarketOverviewLoading(isLoadingMarketOverview);
	}, [isLoadingMarketOverview, setMarketOverviewLoading]);

	// Update token store with fetched supply market data
	useEffect(() => {
		if (
			supplyMarketData &&
			!isLoadingSupplyMarket &&
			!isSupplyMarketError
		) {
			setSupplyMarketData(supplyMarketData as unknown as UserSupplyData);
		}
	}, [
		supplyMarketData,
		isLoadingSupplyMarket,
		isSupplyMarketError,
		setSupplyMarketData,
	]);

	// Store the query key in a separate effect to avoid infinite loops
	useEffect(() => {
		if (queryKey) {
			setSupplyMarketDataQueryKey(queryKey);
		}
	}, [queryKey, setSupplyMarketDataQueryKey]);

	// Update token store with fetched market overview data
	useEffect(() => {
		if (
			marketOverviewData &&
			!isLoadingMarketOverview &&
			!isMarketOverviewError
		) {
			setMarketOverview(
				marketOverviewData as unknown as SupplyMarketQuickOverview
			);
		}
	}, [
		marketOverviewData,
		isLoadingMarketOverview,
		isMarketOverviewError,
		setMarketOverview,
	]);

	// Store the market overview query key in a separate effect
	useEffect(() => {
		if (marketQueryKey) {
			// Use separate effect to avoid infinite loops
			setSupplyMarketOverviewQueryKey(marketQueryKey);
		}
	}, [marketQueryKey, setSupplyMarketOverviewQueryKey]);

	// Refetch data when account changes
	useEffect(() => {
		if (address) {
			refetchSupplyMarket();
			refetchMarketOverview();
		}
	}, [address, refetchSupplyMarket, refetchMarketOverview]);

	return null;
};

export default EarnDataFetcher;
