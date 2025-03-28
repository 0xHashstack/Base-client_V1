import { StatCard } from '@/components/ui/card/stat-card';
import { useTokenStore } from '@/store/useTokenStore';
import React from 'react';
import '@prototype/bigint.prototype';
import { LOCAL_ROUTE } from '@/constant/routes/routes.constant';
import useCustomRouter from '@/hooks/useCustomRouter';

function MyPositionQuickStat() {
	const { userSupplyQuickOverview, isLoadingSupplyMarket } = useTokenStore();
	const { dashboardRouter } = useCustomRouter();
	const pushToUserInsights = () =>
		dashboardRouter.push(LOCAL_ROUTE.USER.INSIGHTS);

	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Total Positions'
				value={
					'$' +
					userSupplyQuickOverview.totalSuppliedValueUsd.formatBalance(
						18
					)
				}
				isLoading={isLoadingSupplyMarket}
				onClick={pushToUserInsights}
				className='cursor-pointer'
			/>

			<StatCard
				title='Total APR'
				value={
					userSupplyQuickOverview.weightedNetApy.formatBalance(18) +
					'%'
				}
				isLoading={isLoadingSupplyMarket}
				valueClassName='text-success'
				onClick={pushToUserInsights}
				className='cursor-pointer'
			/>
		</div>
	);
}

export default MyPositionQuickStat;
