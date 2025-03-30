'use client';
import React from 'react';
import BorrowQuickStat from '../common/borrow-quick-stat';
import BorrowCard from './borrow-card';
import { useTokenStore } from '@/store/useTokenStore';
import { useBorrowDrawer } from '../../context/borrow-drawer.context';
import { MarketLoan } from '@/types/web3/borrow-market.types';
import '@prototype/bigint.prototype';
import If from '@/components/common/If';
import BorrowForm from '../form/borrow-form';
import { Text } from '@/components/ui/typography/Text';
import { Skeleton } from '@/components/ui/skeleton/skeleton';

function BorrowCardStack() {
	const { openDrawer, setDrawerContent } = useBorrowDrawer();
	const { borrowMarketData, isLoadingBorrowMarket } = useTokenStore();

	// Handle opening the borrow drawer
	const handleBorrowClick = (market: MarketLoan) => {
		setDrawerContent(<BorrowForm borrowMarket={market} />);
		// Open the drawer
		openDrawer();
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Borrow Markets</Text.Medium20>
				<BorrowQuickStat />
			</div>
			<If isTrue={isLoadingBorrowMarket}>
				<div className='flex flex-col gap-4'>
					{[...Array(3)].map((_, index) => (
						<Skeleton
							className='h-48 w-full'
							key={`shimmer-${index}`}
						/>
					))}
				</div>
			</If>
			{!isLoadingBorrowMarket && borrowMarketData.length === 0 && (
				<div className='text-center py-4'>No markets available</div>
			)}
			{!isLoadingBorrowMarket && borrowMarketData.length > 0 && (
				<>
					{borrowMarketData.map((market) => (
						<BorrowCard
							key={market.asset.address_}
							market={market}
							onBorrowClick={() => handleBorrowClick(market)}
						/>
					))}
				</>
			)}
		</div>
	);
}

export default BorrowCardStack;
