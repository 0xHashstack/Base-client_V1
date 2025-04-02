import { StatCard } from '@/components/ui/card/stat-card';
import { useTokenStore } from '@/store/useTokenStore';
import '@prototype/bigint.prototype';
import useCustomRouter from '@/hooks/useCustomRouter';
import { LOCAL_ROUTE } from '@/constant/routes/routes.constant';
import { DECIMALS } from '@/constant/web3/decimal.constant';

function BorrowQuickStat() {
	const { borrowMarketQuickOverview, isLoadingBorrowMarketOverview } =
		useTokenStore();
	const { dashboardRouter } = useCustomRouter();

	const pushToProtocolInsights = () => {
		dashboardRouter.push(LOCAL_ROUTE.PROTOCOL.INSIGHTS);
	};

	return (
		<div className='flex gap-2 tablet:gap-4 items-center flex-wrap'>
			<StatCard
				title='Total Debt'
				value={
					'$' +
					borrowMarketQuickOverview.totalDebt.formatBalance(
						DECIMALS.PRICE
					)
				}
				isLoading={isLoadingBorrowMarketOverview}
				onClick={pushToProtocolInsights}
				className='cursor-pointer'
			/>
			<StatCard
				title='Avg Borrow APR'
				value={
					borrowMarketQuickOverview.avgBorrowApr.formatBalance(
						DECIMALS.APR
					) + '%'
				}
				isLoading={isLoadingBorrowMarketOverview}
				valueClassName='text-error'
				onClick={pushToProtocolInsights}
				className='cursor-pointer'
			/>
			<StatCard
				title='Avg Utilization'
				value={
					borrowMarketQuickOverview.avgUtilization.formatBalance(
						DECIMALS.UTILIZATION
					) + '%'
				}
				isLoading={isLoadingBorrowMarketOverview}
				onClick={pushToProtocolInsights}
				className='cursor-pointer'
			/>
		</div>
	);
}

export default BorrowQuickStat;
