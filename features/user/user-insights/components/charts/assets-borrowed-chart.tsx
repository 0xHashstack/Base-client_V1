'use client';

import React, { useState } from 'react';
import TimePeriodSelector, {
	TimePeriod,
} from '@/components/ui/chart/time-period-selector';
import ChartHeading from '@/components/ui/chart/chart-heading';
import { formatCurrency } from '@/lib/utils';
import { TokenData } from '../../services/mock-data.service';
import BarChart from '@/components/ui/chart/bar-chart';

interface AssetsBorrowedChartProps {
	tokens: TokenData[];
	totalBorrowed: number;
	isLoading?: boolean;
	data?: TokenData[]; // Optional since we're not using it directly
}

const AssetsBorrowedChart: React.FC<AssetsBorrowedChartProps> = ({
	tokens,
	totalBorrowed,
	isLoading = false,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

	// Transform token data for bar chart
	const chartData = tokens.map((token) => ({
		name: token.symbol,
		value: token.value,
		color: token.color,
	}));

	return (
		<div className='bg-card rounded-lg p-6 w-full'>
			<div className='flex justify-between items-start mb-6'>
				<div>
					<ChartHeading
						title='Assets borrowed'
						value={formatCurrency(totalBorrowed)}
						isLoading={isLoading}
					/>
				</div>
				<TimePeriodSelector
					selectedPeriod={selectedPeriod}
					onChange={setSelectedPeriod}
				/>
			</div>

			<BarChart
				data={chartData}
				color='hsl(var(--chart-1))'
				barSize={34}
				height='200px'
			/>
		</div>
	);
};

export default AssetsBorrowedChart;
