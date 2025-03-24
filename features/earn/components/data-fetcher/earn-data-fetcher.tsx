import React, { useEffect } from 'react';

import { useReadContract } from 'wagmi';
import {
	intermediateContract,
	web3DataProvider,
} from '@/constant/config/web3-config.constant';
import { useTokenStore } from '@/store/useTokenStore';
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

	// Call getUserSupplyMarketData from the intermediate contract
	const {
		data: supplyMarketData,
		isLoading: isLoadingSupplyMarket,
		isError: isSupplyMarketError,
		refetch: refetchSupplyMarket,
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
			console.log('Supply market data:', supplyMarketData, { address });
			setSupplyMarketData(supplyMarketData as unknown as UserSupplyData);
		}
	}, [
		supplyMarketData,
		isLoadingSupplyMarket,
		isSupplyMarketError,
		setSupplyMarketData,
	]);

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
