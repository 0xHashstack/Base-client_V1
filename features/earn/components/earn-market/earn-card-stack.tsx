'use client';
import React from 'react';
import EarnQuickStat from '../common/earn-quick-stat';
import EarnSupplyCard from './earn-supply-card';
import { useTokenStore } from '@/store/useTokenStore';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';
import { SupplyMarketData } from '@/types/web3/supply-market.types';
import '@prototype/bigint.prototype';
import If from '@/components/common/If';
import SupplyForm from '../form/supply-form';
import { Text } from '@/components/ui/typography/Text';

function EarnCardStack() {
	const { openDrawer, setDrawerContent } = useEarnDrawer();
	const { supplyMarketData, isLoadingSupplyMarket } = useTokenStore();

	// Handle opening the supply drawer
	const handleSupplyClick = (market: SupplyMarketData) => {
		setDrawerContent(<SupplyForm market={market} />);
		// Open the drawer
		openDrawer();
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Earn Markets</Text.Medium20>
				<EarnQuickStat />
			</div>
			<If isTrue={isLoadingSupplyMarket}>
				<div className='py-4 text-center'>Loading markets...</div>
			</If>
			{!isLoadingSupplyMarket && supplyMarketData.length === 0 && (
				<div className='text-center py-4'>No markets available</div>
			)}
			{!isLoadingSupplyMarket && supplyMarketData.length > 0 && (
				<>
					{supplyMarketData.map((market) => (
						<EarnSupplyCard
							key={market.asset.address_}
							market={market}
							onSupplyClick={() => handleSupplyClick(market)}
						/>
					))}
				</>
			)}
		</div>
	);
}

export default EarnCardStack;
