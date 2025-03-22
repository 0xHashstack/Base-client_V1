import React, { useEffect } from 'react';

import { useReadContract } from 'wagmi';
import {
	intermediateContract,
	web3DataProvider,
} from '@/constant/config/web3-config.constant';
import { useTokenStore } from '@/store/useTokenStore';
import { UserSupplyData } from '@/types/web3/supply-market.types';
import { useDappUser } from '@/context/user-data.context';
import { FALLBACK_USER_ADDRESS } from '@/constant/web3';

/**
 * A wrapper component for the Earn view that fetches data for the EarnTable and EarnCardStack
 * using the useReadContract hook from wagmi
 */
const EarnDataFetcher: React.FC = () => {
	const { address = FALLBACK_USER_ADDRESS } = useDappUser();

	// Get token store actions
	const { setSupplyMarketData, setSupplyMarketLoading } = useTokenStore();

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

	// Update loading state when fetching starts
	useEffect(() => {
		setSupplyMarketLoading(isLoadingSupplyMarket);
	}, [isLoadingSupplyMarket, setSupplyMarketLoading]);

	// Update token store with fetched data
	useEffect(() => {
		if (
			supplyMarketData &&
			!isLoadingSupplyMarket &&
			!isSupplyMarketError
		) {
			console.log('Supply market data:', supplyMarketData);
			setSupplyMarketData(supplyMarketData as unknown as UserSupplyData);
		}
	}, [
		supplyMarketData,
		isLoadingSupplyMarket,
		isSupplyMarketError,
		setSupplyMarketData,
	]);

	// Refetch data when account changes
	useEffect(() => {
		if (address) {
			refetchSupplyMarket();
		}
	}, [address, refetchSupplyMarket]);

	return null;
};

export default EarnDataFetcher;
