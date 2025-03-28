import React, { useState } from 'react';
import LineChart, {
	ChartDataPoint,
} from '../../../../../components/ui/chart/line-chart';
import TimePeriodSelector, {
	TimePeriod,
} from '../../../../../components/ui/chart/time-period-selector';
import { formatCurrency } from '@/lib/utils';
import ChartHeading from '@/components/ui/chart/chart-heading';

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
				<ChartHeading
					title='Total Value Locked'
					value={formatCurrency(totalValueLocked)}
					isLoading={isLoading}
				/>

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
