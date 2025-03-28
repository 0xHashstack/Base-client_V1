'use client';

import React from 'react';
import {
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export interface BarChartDataPoint {
	name: string;
	value: number;
	color?: string;
}

interface BarChartProps {
	data: BarChartDataPoint[];
	color?: string;
	barSize?: number;
	height?: number | string;
	className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
	data,
	color = 'hsl(var(--chart-1))',
	barSize = 34,
	height = '200px',
	className,
}) => {
	return (
		<div className={`h-[${typeof height === 'string' ? height : `${height}px`}] ${className || ''}`}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsBarChart
					data={data}
					margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
						opacity={0.1}
					/>
					<XAxis
						dataKey="name"
						tickLine={false}
						axisLine={false}
						tick={{ fontSize: 10, fill: 'hsl(var(--text-secondary-500))' }}
					/>
					<YAxis
						tickFormatter={(value) =>
							`$${(value / 1000).toFixed(0)}k`
						}
						tickLine={false}
						axisLine={false}
						tick={{ fontSize: 10, fill: 'hsl(var(--text-secondary-500))' }}
						width={40}
					/>
					<Tooltip
						formatter={(value: number) => [
							`$${value.toLocaleString()}`,
							'Value',
						]}
						labelFormatter={(label) => `${label}`}
						contentStyle={{
							backgroundColor: 'hsl(var(--card))',
							borderRadius: '6px',
							border: 'none',
							boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
						}}
						itemStyle={{
							color: 'hsl(var(--text-primary-900))',
						}}
						labelStyle={{
							color: 'hsl(var(--text-primary-900))',
							marginBottom: '4px',
						}}
					/>
					<Bar
						dataKey="value"
						barSize={barSize}
						radius={[4, 4, 0, 0]}
						fill={color}
						fillOpacity={1}
						isAnimationActive={false}
					/>
				</RechartsBarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default BarChart;
