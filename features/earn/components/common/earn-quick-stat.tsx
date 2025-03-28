import { StatCard } from '@/components/ui/card/stat-card';
import { useTokenStore } from '@/store/useTokenStore';
import React from 'react';
import '@prototype/bigint.prototype';
import useCustomRouter from '@/hooks/useCustomRouter';
import { LOCAL_ROUTE } from '@/constant/routes/routes.constant';
function EarnQuickStat() {
	const { supplyMarketQuickOverview, isLoadingSupplyMarketOverview } =
		useTokenStore();
	const { dashboardRouter } = useCustomRouter();
	const pushToProtocolInsights = () => {
		dashboardRouter.push(LOCAL_ROUTE.PROTOCOL.INSIGHTS);
	};
	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Market Deposit'
				value={
					'$' +
					supplyMarketQuickOverview.marketDeposit.formatBalance(18)
				}
				isLoading={isLoadingSupplyMarketOverview}
				onClick={pushToProtocolInsights}
				className='cursor-pointer'
			/>

			<StatCard
				title='Market APR'
				value={
					supplyMarketQuickOverview.marketApr.formatBalance(18) + '%'
				}
				isLoading={isLoadingSupplyMarketOverview}
				valueClassName='text-success'
				onClick={pushToProtocolInsights}
				className='cursor-pointer'
			/>
		</div>
	);
}

export default EarnQuickStat;
