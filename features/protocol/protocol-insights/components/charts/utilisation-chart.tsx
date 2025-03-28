import React, { useState } from 'react';
import LineChart, { ChartDataPoint } from './line-chart';
import { StatCard } from '@/components/ui/card/stat-card';
import TimePeriodSelector, { TimePeriod } from '../time-period-selector';

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
				<div>
					<StatCard
						title='Utilisation'
						value={`${utilisationRate.toFixed(1)}%`}
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
					areaColor='#3B82F6'
					strokeColor='#2563EB'
					yAxisFormatter={(value) => `${value}%`}
				/>
			</div>
		</div>
	);
};

export default UtilisationChart;
