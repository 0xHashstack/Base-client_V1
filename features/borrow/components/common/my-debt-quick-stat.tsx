import { StatCard } from '@/components/ui/card/stat-card';
import { useTokenStore } from '@/store/useTokenStore';
import React from 'react';
import '@prototype/bigint.prototype';
import { LOCAL_ROUTE } from '@/constant/routes/routes.constant';
import useCustomRouter from '@/hooks/useCustomRouter';

function MyDebtQuickStat() {
	const { userBorrowQuickOverview, isLoadingBorrowMarket } = useTokenStore();
	const { dashboardRouter } = useCustomRouter();

	const pushToUserInsights = () =>
		dashboardRouter.push(LOCAL_ROUTE.USER.INSIGHTS);

	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Total Debt'
				value={
					'$' +
					userBorrowQuickOverview.totalBorrowedValueUsd.formatBalance(
						18
					)
				}
				isLoading={isLoadingBorrowMarket}
				onClick={pushToUserInsights}
				className='cursor-pointer'
			/>
			<StatCard
				title='Weighted Borrow APR'
				value={
					userBorrowQuickOverview.weightedBorrowApr.formatBalance(
						18
					) + '%'
				}
				isLoading={isLoadingBorrowMarket}
				valueClassName='text-error'
				onClick={pushToUserInsights}
				className='cursor-pointer'
			/>
		</div>
	);
}

export default MyDebtQuickStat;
