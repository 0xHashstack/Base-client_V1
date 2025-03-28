import React, { useState } from 'react';
import LineChart, { ChartDataPoint } from './line-chart';
import TimePeriodSelector, { TimePeriod } from '../time-period-selector';
import { StatCard } from '@/components/ui/card/stat-card';

interface BorrowAprChartProps {
	data: {
		[key in TimePeriod]: ChartDataPoint[];
	};
	borrowApr: number;
	isLoading?: boolean;
}

const BorrowAprChart: React.FC<BorrowAprChartProps> = ({
	data,
	borrowApr,
	isLoading = false,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

	return (
		<div className='bg-card rounded-lg p-6 w-full'>
			<div className='flex justify-between items-start mb-6'>
				<div>
					<StatCard
						title='Borrow APR'
						value={`${borrowApr.toFixed(2)}%`}
						isLoading={isLoading}
					/>
				</div>
				<TimePeriodSelector
					selectedPeriod={selectedPeriod}
					onChange={setSelectedPeriod}
				/>
			</div>

			<div className='h-[200px]'>
				<LineChart
					data={data[selectedPeriod]}
					height={200}
					areaColor='#F97316'
					strokeColor='#EA580C'
					yAxisFormatter={(value) => `${value}%`}
				/>
			</div>
		</div>
	);
};

export default BorrowAprChart;
