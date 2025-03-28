'use client';

import React, { useState } from 'react';
import LineChart, { ChartDataPoint } from '@/components/ui/chart/line-chart';
import TimePeriodSelector, { TimePeriod } from '@/components/ui/chart/time-period-selector';
import ChartHeading from '@/components/ui/chart/chart-heading';
import { formatCurrency } from '@/lib/utils';

interface NetValueChartProps {
	data: {
		[key in TimePeriod]: ChartDataPoint[];
	};
	netValue: number;
	isLoading?: boolean;
}

const NetValueChart: React.FC<NetValueChartProps> = ({
	data,
	netValue,
	isLoading = false,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

	return (
		<div className='bg-card rounded-lg p-6 w-full'>
			<div className='flex justify-between items-start mb-6'>
				<div>
					<ChartHeading
						title='Net Value'
						value={formatCurrency(netValue)}
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
					yAxisFormatter={(value) => `$${value.toLocaleString()}`}
				/>
			</div>
		</div>
	);
};

export default NetValueChart;
