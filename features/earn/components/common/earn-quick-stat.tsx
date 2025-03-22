import { StatCard } from '@/components/ui/card/stat-card';
import { useTokenStore } from '@/store/useTokenStore';
import React from 'react';
import '@prototype/bigint.prototype';
function EarnQuickStat() {
	const { supplyMarketQuickOverview, isLoadingSupplyMarketOverview } =
		useTokenStore();
	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Market Deposit'
				value={
					'$' +
					supplyMarketQuickOverview.marketDeposit.formatBalance(18)
				}
				isLoading={isLoadingSupplyMarketOverview}
				className='min-w-[200px]'
			/>

			<StatCard
				title='Market APR'
				value={
					supplyMarketQuickOverview.marketApr.formatBalance(18) + '%'
				}
				isLoading={isLoadingSupplyMarketOverview}
				valueClassName='text-success'
			/>
		</div>
	);
}

export default EarnQuickStat;
