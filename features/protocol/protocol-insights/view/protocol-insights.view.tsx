'use client';
import React from 'react';
import TotalValueLockedChart from '../components/charts/total-value-locked-chart';
import BorrowChart from '../components/charts/borrow-chart';
import UtilisationChart from '../components/charts/utilisation-chart';
import SupplyAprChart from '../components/charts/supply-apr-chart';
import BorrowAprChart from '../components/charts/borrow-apr-chart';
import { getProtocolInsightsData } from '../services/mock-data.service';
import { Text } from '@/components/ui/typography/Text';
import ProtocolQuickStat from '../components/common/protocol-quick-stat';

const ProtocolInsightsView: React.FC = () => {
	const insightsData = getProtocolInsightsData();

	return (
		<div className='flex flex-col relative flex-1 gap-9'>
			<div className='flex justify-between items-center mb-2'>
				<Text.Semibold24>Protocol level insights</Text.Semibold24>
				<ProtocolQuickStat
					marketDeposit={insightsData.marketDeposit}
					netApr={insightsData.netApr}
				/>
			</div>

			<div className='grid grid-cols-1 gap-6'>
				<TotalValueLockedChart
					data={insightsData.tvl.data}
					totalValueLocked={insightsData.tvl.value}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<BorrowChart
					data={insightsData.borrow.data}
					tokens={insightsData.borrow.tokens}
					totalBorrowed={insightsData.borrow.value}
				/>
				<UtilisationChart
					data={insightsData.utilisation.data}
					utilisationRate={insightsData.utilisation.value}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<SupplyAprChart
					data={insightsData.supplyApr.data}
					supplyApr={insightsData.supplyApr.value}
				/>
				<BorrowAprChart
					data={insightsData.borrowApr.data}
					borrowApr={insightsData.borrowApr.value}
				/>
			</div>
		</div>
	);
};

export default ProtocolInsightsView;
