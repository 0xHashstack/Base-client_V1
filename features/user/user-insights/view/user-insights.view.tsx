'use client';

import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import UserQuickStat from '../components/common/user-quick-stat';
import NetValueChart from '../components/charts/net-value-chart';
import { getUserInsightsData } from '../services/mock-data.service';
import NetAprChart from '../components/charts/net-apr-chart';
import AssetsSuppliedChart from '../components/charts/assets-supplied-chart';
import AssetsBorrowedChart from '../components/charts/assets-borrowed-chart';

const UserInsightsView: React.FC = () => {
	const insightsData = getUserInsightsData();

	return (
		<div className='flex flex-col relative flex-1 gap-4 tablet:gap-9 '>
			<div className='flex justify-between items-center mb-2 flex-wrap gap-4'>
				<Text.Semibold24>User level insights</Text.Semibold24>
				<UserQuickStat
					marketDeposit={insightsData.marketDeposit}
					netApr={insightsData.netApr}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<NetValueChart
					data={insightsData.netValue.data}
					netValue={insightsData.netValue.value}
				/>
				<NetAprChart
					data={insightsData.netAprChart.data}
					netApr={insightsData.netAprChart.value}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<AssetsSuppliedChart
					data={insightsData.assetsSupplied.data}
					tokens={insightsData.assetsSupplied.tokens}
					totalSupplied={insightsData.assetsSupplied.value}
				/>
				<AssetsBorrowedChart
					data={insightsData.assetsBorrowed.data}
					tokens={insightsData.assetsBorrowed.tokens}
					totalBorrowed={insightsData.assetsBorrowed.value}
				/>
			</div>
		</div>
	);
};

export default UserInsightsView;
