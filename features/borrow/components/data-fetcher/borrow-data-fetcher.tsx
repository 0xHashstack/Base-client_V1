import React, { useEffect } from 'react';

import { useReadContract } from 'wagmi';
import { intermediateContract } from '@/constant/config/web3-config.constant';
import { useTokenStore } from '@/store/useTokenStore';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';
import {
	UserBorrowData,
	BorrowMarketQuickOverview,
} from '@/types/web3/borrow-market.types';
import { useDappUser } from '@/context/user-data.context';
import { FALLBACK_USER_ADDRESS } from '@/constant/web3';

/**
 * A wrapper component for the Borrow view that fetches data for the BorrowTable and MyDebtTable
 * using the useReadContract hook from wagmi
 */
const BorrowDataFetcher: React.FC = () => {
	const { address = FALLBACK_USER_ADDRESS } = useDappUser();

	// Get token store actions using individual selectors for optimal rendering
	const setBorrowMarketData = useTokenStore(
		(state) => state.setBorrowMarketData
	);
	const setBorrowMarketLoading = useTokenStore(
		(state) => state.setBorrowMarketLoading
	);
	const setBorrowMarketOverview = useTokenStore(
		(state) => state.setBorrowMarketOverview
	);
	const setBorrowMarketOverviewLoading = useTokenStore(
		(state) => state.setBorrowMarketOverviewLoading
	);

	// Get query key store actions using individual selectors
	const setBorrowMarketDataQueryKey = useQueryKeyStore(
		(state) => state.setBorrowMarketDataQueryKey
	);
	const setBorrowMarketOverviewQueryKey = useQueryKeyStore(
		(state) => state.setBorrowMarketOverviewQueryKey
	);

	// Call getUserBorrowData from the intermediate contract
	const {
		data: borrowMarketData,
		isLoading: isLoadingBorrowMarket,
		isError: isBorrowMarketError,
		refetch: refetchBorrowMarket,
		queryKey,
	} = useReadContract({
		...intermediateContract.getContractConfig('getUserBorrowData', [
			address,
		]),
		query: {
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	});

	// Call getBorrowMarketOverview from the intermediate contract
	const {
		data: marketOverviewData,
		isLoading: isLoadingMarketOverview,
		isError: isMarketOverviewError,
		refetch: refetchMarketOverview,
		queryKey: marketQueryKey,
	} = useReadContract({
		...intermediateContract.getContractConfig(
			'getBorrowMarketOverview',
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
		setBorrowMarketLoading(isLoadingBorrowMarket);
	}, [isLoadingBorrowMarket, setBorrowMarketLoading]);

	useEffect(() => {
		setBorrowMarketOverviewLoading(isLoadingMarketOverview);
	}, [isLoadingMarketOverview, setBorrowMarketOverviewLoading]);

	// Update token store with fetched borrow market data
	useEffect(() => {
		if (
			borrowMarketData &&
			!isLoadingBorrowMarket &&
			!isBorrowMarketError
		) {
			// Update the store with processed data
			setBorrowMarketData(borrowMarketData as UserBorrowData);
		}
	}, [
		borrowMarketData,
		isLoadingBorrowMarket,
		isBorrowMarketError,
		setBorrowMarketData,
	]);

	// Store the query key in a separate effect to avoid infinite loops
	useEffect(() => {
		if (queryKey) {
			setBorrowMarketDataQueryKey(queryKey);
		}
	}, [queryKey, setBorrowMarketDataQueryKey]);

	// Update token store with fetched market overview data
	useEffect(() => {
		if (
			marketOverviewData &&
			!isLoadingMarketOverview &&
			!isMarketOverviewError
		) {
			setBorrowMarketOverview(
				marketOverviewData as BorrowMarketQuickOverview
			);
		}
	}, [
		marketOverviewData,
		isLoadingMarketOverview,
		isMarketOverviewError,
		setBorrowMarketOverview,
	]);

	// Store the market overview query key in a separate effect
	useEffect(() => {
		if (marketQueryKey) {
			// Use separate effect to avoid infinite loops
			setBorrowMarketOverviewQueryKey(marketQueryKey);
		}
	}, [marketQueryKey, setBorrowMarketOverviewQueryKey]);

	// Refetch data when account changes
	useEffect(() => {
		if (address) {
			refetchBorrowMarket();
			refetchMarketOverview();
		}
	}, [address, refetchBorrowMarket, refetchMarketOverview]);

	return null;
};

export default BorrowDataFetcher;
