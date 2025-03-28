import React, { useState } from 'react';
import LineChart, {
	ChartDataPoint,
} from '../../../../../components/ui/chart/line-chart';
import TimePeriodSelector, {
	TimePeriod,
} from '../../../../../components/ui/chart/time-period-selector';
import ChartHeading from '@/components/ui/chart/chart-heading';

interface UtilisationChartProps {
	data: {
		[key in TimePeriod]: ChartDataPoint[];
	};
	utilisationRate: number;
	isLoading?: boolean;
}

const UtilisationChart: React.FC<UtilisationChartProps> = ({
	data,
	utilisationRate,
	isLoading = false,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

	return (
		<div className='bg-card rounded-lg p-6 w-full'>
			<div className='flex justify-between items-start mb-6'>
				<ChartHeading
					title='Utilisation'
					value={`${utilisationRate.toFixed(1)}%`}
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
					areaColor='#3B82F6'
					strokeColor='#2563EB'
					yAxisFormatter={(value) => `${value}%`}
				/>
			</div>
		</div>
	);
};

export default UtilisationChart;
