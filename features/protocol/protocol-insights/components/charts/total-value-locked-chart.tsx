import React, { useState } from 'react';
import LineChart, { ChartDataPoint } from './line-chart';
import TimePeriodSelector, { TimePeriod } from '../time-period-selector';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/ui/card/stat-card';

interface TotalValueLockedChartProps {
	data: {
		[key in TimePeriod]: ChartDataPoint[];
	};
	totalValueLocked: number;
	isLoading?: boolean;
}

const TotalValueLockedChart: React.FC<TotalValueLockedChartProps> = ({
	data,
	totalValueLocked,
	isLoading = false,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

	return (
		<div className='bg-card rounded-lg p-6 w-full'>
			<div className='flex justify-between items-start mb-6'>
				<div>
					<StatCard
						title='Total Value Locked'
						value={formatCurrency(totalValueLocked)}
						isLoading={isLoading}
					/>
				</div>
				<TimePeriodSelector
					selectedPeriod={selectedPeriod}
					onChange={setSelectedPeriod}
				/>
			</div>

			<div className='h-[250px]'>
				<LineChart
					data={data[selectedPeriod]}
					height={250}
					areaColor='#3B82F6'
					strokeColor='#2563EB'
					yAxisFormatter={(value) => `$${value.toLocaleString()}`}
				/>
			</div>
		</div>
	);
};

export default TotalValueLockedChart;
