import { ChartDataPoint } from '@/components/ui/chart/line-chart';
import { TimePeriod } from '@/components/ui/chart/time-period-selector';

// Helper function to generate dates for the past N days
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(`${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`);
  }
  
  return dates;
};

// Generate mock line chart data
const generateLineChartData = (
  days: number, 
  minValue: number, 
  maxValue: number, 
  trend: 'up' | 'down' | 'volatile' | 'stable' = 'up',
  startValue?: number
): ChartDataPoint[] => {
  const dates = generateDates(days);
  const data: ChartDataPoint[] = [];
  
  let currentValue = startValue || minValue + Math.random() * (maxValue - minValue);
  
  dates.forEach((date, index) => {
    // Different trends
    if (trend === 'up') {
      // Upward trend with some volatility
      const change = (Math.random() * 0.05 + 0.01) * currentValue;
      currentValue = Math.min(maxValue, currentValue + change);
    } else if (trend === 'down') {
      // Downward trend with some volatility
      const change = (Math.random() * 0.04 + 0.01) * currentValue;
      currentValue = Math.max(minValue, currentValue - change);
    } else if (trend === 'volatile') {
      // Highly volatile
      const direction = Math.random() > 0.5 ? 1 : -1;
      const change = (Math.random() * 0.1 + 0.02) * currentValue;
      currentValue = Math.max(minValue, Math.min(maxValue, currentValue + direction * change));
    } else {
      // Stable with minor changes
      const direction = Math.random() > 0.5 ? 1 : -1;
      const change = (Math.random() * 0.02) * currentValue;
      currentValue = Math.max(minValue, Math.min(maxValue, currentValue + direction * change));
    }
    
    // Add some plateaus and jumps to make it look more realistic
    if (index > 0 && index % 7 === 0 && Math.random() > 0.7) {
      // Significant jump up or down
      const jumpDirection = Math.random() > 0.6 ? 1 : -1;
      const jumpSize = (Math.random() * 0.15 + 0.05) * currentValue;
      currentValue = Math.max(minValue, Math.min(maxValue, currentValue + jumpDirection * jumpSize));
    }
    
    data.push({
      date,
      value: Math.round(currentValue * 100) / 100
    });
  });
  
  return data;
};

// Define trend type to match the implementation
type TrendType = 'up' | 'down' | 'volatile' | 'stable';

// Generate data for different time periods
const generateDataForPeriods = <T>(
  generator: (days: number, minValue: number, maxValue: number, trend?: TrendType, startValue?: number) => T[],
  args: [number, number, TrendType?, number?]
): Record<TimePeriod, T[]> => {
  return {
    '1D': generator(1, ...args),
    '1W': generator(7, ...args),
    '1M': generator(30, ...args),
    'All': generator(90, ...args)
  };
};

export interface TokenData {
  symbol: string;
  color: string;
  value: number;
}

// Mock data for user insights
export const getUserInsightsData = () => {
  // Net Value data
  const netValueData = generateDataForPeriods(
    generateLineChartData,
    [5000, 10000, 'up', 7568.87]
  );
  
  // Net APR data
  const netAprData = generateDataForPeriods(
    generateLineChartData,
    [50, 100, 'volatile', 92.8]
  );
  
  // Assets supplied data
  const suppliedTokens: TokenData[] = [
    { symbol: 'USDC', color: 'var(--chart-1)', value: 30000 },
    { symbol: 'USDT', color: 'var(--chart-2)', value: 60000 },
    { symbol: 'wETH', color: 'var(--chart-3)', value: 8000 },
    { symbol: 'wBTC', color: 'var(--chart-4)', value: 16000 }
  ];
  
  // Assets borrowed data
  const borrowedTokens: TokenData[] = [
    { symbol: 'USDC', color: 'var(--chart-1)', value: 28000 },
    { symbol: 'USDT', color: 'var(--chart-2)', value: 29000 },
    { symbol: 'wETH', color: 'var(--chart-3)', value: 60000 },
    { symbol: 'wBTC', color: 'var(--chart-4)', value: 40000 }
  ];
  
  return {
    marketDeposit: 97689.32,
    netApr: 3.476,
    netValue: {
      value: 7568.87,
      data: netValueData
    },
    netAprChart: {
      value: 92.8,
      data: netAprData
    },
    assetsSupplied: {
      value: 114.76,
      tokens: suppliedTokens,
      data: suppliedTokens
    },
    assetsBorrowed: {
      value: 214.76,
      tokens: borrowedTokens,
      data: borrowedTokens
    }
  };
};
