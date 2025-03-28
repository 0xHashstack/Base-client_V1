import React from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export interface ChartDataPoint {
	date: string;
	value: number;
}

interface LineChartProps {
	data: ChartDataPoint[];
	height?: number;
	areaColor?: string;
	strokeColor?: string;
	yAxisFormatter?: (value: number) => string;
}

const LineChart: React.FC<LineChartProps> = ({
	data,
	height = 200,
	areaColor = '#1A62F633',
	strokeColor = '#1A62F6',
	yAxisFormatter = (value) => `${value}`,
}) => {
	return (
		<ResponsiveContainer
			width='100%'
			height={height}>
			<AreaChart
				data={data}
				margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
				<defs>
					<linearGradient
						id={`colorGradient-${areaColor.slice(1)}`}
						x1='0'
						y1='0'
						x2='0'
						y2='1'>
						<stop
							offset='5%'
							stopColor={areaColor}
							stopOpacity={0.8}
						/>
						<stop
							offset='95%'
							stopColor={areaColor}
							stopOpacity={0.1}
						/>
					</linearGradient>
				</defs>
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
					tickFormatter={yAxisFormatter}
					tickLine={false}
					axisLine={false}
					tick={{ fontSize: 10, fill: '#94a3b8' }}
					width={40}
				/>
				<Tooltip
					formatter={(value: number) => [
						yAxisFormatter(value),
						'Value',
					]}
					labelFormatter={(label) => `Date: ${label}`}
					contentStyle={{
						backgroundColor: '#1e293b',
						borderRadius: '6px',
						border: 'none',
					}}
					itemStyle={{ color: '#e2e8f0' }}
					labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
				/>
				<Area
					type='monotone'
					dataKey='value'
					stroke={strokeColor}
					strokeWidth={2}
					fillOpacity={1}
					fill={`url(#colorGradient-${areaColor.slice(1)})`}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

export default LineChart;
