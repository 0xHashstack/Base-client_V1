import React, { useState } from 'react';
import LineChart, { ChartDataPoint } from './line-chart';

import TimePeriodSelector, { TimePeriod } from '../time-period-selector';
import { StatCard } from '@/components/ui/card/stat-card';

interface SupplyAprChartProps {
	data: {
		[key in TimePeriod]: ChartDataPoint[];
	};
	supplyApr: number;
	isLoading?: boolean;
}

const SupplyAprChart: React.FC<SupplyAprChartProps> = ({
	data,
	supplyApr,
	isLoading = false,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

	return (
		<div className='bg-card rounded-lg p-6 w-full'>
			<div className='flex justify-between items-start mb-6'>
				<div>
					<StatCard
						title='Supply APR'
						value={`${supplyApr.toFixed(3)}%`}
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
					areaColor='#10B981'
					strokeColor='#059669'
					yAxisFormatter={(value) => `${value}%`}
				/>
			</div>
		</div>
	);
};

export default SupplyAprChart;
