import React, { useState } from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import TimePeriodSelector, {
	TimePeriod,
} from '../../../../../components/ui/chart/time-period-selector';
import { formatCurrency } from '@/lib/utils';

import ChartHeading from '@/components/ui/chart/chart-heading';

interface TokenData {
	symbol: string;
	color: string;
}

export interface StackedChartDataPoint {
	date: string;
	[key: string]: number | string;
}

interface BorrowChartProps {
	data: {
		[key in TimePeriod]: StackedChartDataPoint[];
	};
	tokens: TokenData[];
	totalBorrowed: number;
	isLoading?: boolean;
}

const BorrowChart: React.FC<BorrowChartProps> = ({
	data,
	tokens,
	totalBorrowed,
	isLoading = false,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

	return (
		<div className='bg-card rounded-lg p-6 w-full'>
			<div className='flex justify-between items-start mb-6'>
				<div>
					<ChartHeading
						title='Borrow'
						value={formatCurrency(totalBorrowed)}
						isLoading={isLoading}
					/>
				</div>
				<TimePeriodSelector
					selectedPeriod={selectedPeriod}
					onChange={setSelectedPeriod}
				/>
			</div>

			<div className='h-[200px]'>
				<ResponsiveContainer
					width='100%'
					height='100%'>
					<AreaChart
						data={data[selectedPeriod]}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
						<CartesianGrid
							strokeDasharray='3 3'
							vertical={false}
							opacity={0.1}
						/>
						<XAxis
							dataKey='date'
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10, fill: '#94a3b8' }}
							padding={{ left: 10, right: 10 }}
						/>
						<YAxis
							tickFormatter={(value) =>
								`$${(value / 1000).toFixed(0)}k`
							}
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10, fill: '#94a3b8' }}
							width={40}
						/>
						<Tooltip
							formatter={(value: number, name: string) => [
								`$${value.toLocaleString()}`,
								tokens.find((t) => t.symbol === name)?.symbol ||
									name,
							]}
							labelFormatter={(label) => `Date: ${label}`}
							contentStyle={{
								backgroundColor: '#1e293b',
								borderRadius: '6px',
								border: 'none',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
							itemStyle={{ color: '#e2e8f0' }}
							labelStyle={{
								color: '#94a3b8',
								marginBottom: '4px',
							}}
						/>

						{/* No gradient definitions needed for solid colors */}

						{tokens.map((token) => (
							<Area
								key={token.symbol}
								type='monotone'
								dataKey={token.symbol}
								stackId='1'
								stroke={token.color}
								fill={token.color}
								fillOpacity={1}
							/>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>

			<div className='flex gap-4 mt-4 justify-center'>
				{tokens.map((token) => (
					<div
						key={token.symbol}
						className='flex items-center gap-2'>
						<div
							className='w-3 h-3 rounded-full'
							style={{ backgroundColor: token.color }}
						/>
						<span className='text-xs text-muted-foreground'>
							{token.symbol}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default BorrowChart;
