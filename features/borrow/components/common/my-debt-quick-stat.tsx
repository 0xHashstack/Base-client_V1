import { StatCard } from '@/components/ui/card/stat-card';
import { useTokenStore } from '@/store/useTokenStore';
import React from 'react';
import '@prototype/bigint.prototype';
import { LOCAL_ROUTE } from '@/constant/routes/routes.constant';
import useCustomRouter from '@/hooks/useCustomRouter';
import { DECIMALS } from '@/constant/web3/decimal.constant';

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
						DECIMALS.PRICE
					)
				}
				isLoading={isLoadingBorrowMarket}
				onClick={pushToUserInsights}
				className='cursor-pointer'
			/>
			<StatCard
				title='Weighted Borrow APR'
				value={
					userBorrowQuickOverview.totalBorrowApr.formatBalance(
						DECIMALS.APR
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
