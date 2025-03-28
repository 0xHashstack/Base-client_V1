import React, { useState } from 'react';
import LineChart, {
	ChartDataPoint,
} from '../../../../../components/ui/chart/line-chart';

import TimePeriodSelector, {
	TimePeriod,
} from '../../../../../components/ui/chart/time-period-selector';
import ChartHeading from '@/components/ui/chart/chart-heading';

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
				<ChartHeading
					title='Supply APR'
					value={`${supplyApr.toFixed(3)}%`}
					isLoading={isLoading}
				/>

				<TimePeriodSelector
					selectedPeriod={selectedPeriod}
					onChange={setSelectedPeriod}
				/>
			</div>

			<div className='h-[200px]'>
				<LineChart
					data={data[selectedPeriod]}
					height={200}
					yAxisFormatter={(value) => `${value}%`}
				/>
			</div>
		</div>
	);
};

export default SupplyAprChart;
