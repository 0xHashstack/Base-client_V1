import { StatCard } from '@/components/ui/card/stat-card';
import { useTokenStore } from '@/store/useTokenStore';
import React from 'react';
import '@prototype/bigint.prototype';

function MyPositionQuickStat() {
	const { userSupplyQuickOverview, isLoadingSupplyMarket } = useTokenStore();

	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Total Positions'
				value={
					'$' +
					userSupplyQuickOverview.totalSuppliedValueUsd.formatBalance(18)
				}
				isLoading={isLoadingSupplyMarket}
				className='min-w-[200px]'
			/>

			<StatCard
				title='Total APR'
				value={
					userSupplyQuickOverview.weightedNetApy.formatBalance(18) + '%'
				}
				isLoading={isLoadingSupplyMarket}
				valueClassName='text-success'
			/>
		</div>
	);
}

export default MyPositionQuickStat;
