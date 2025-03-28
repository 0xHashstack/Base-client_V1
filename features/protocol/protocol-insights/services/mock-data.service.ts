import { ChartDataPoint } from '../components/charts/line-chart';
import { StackedChartDataPoint } from '../components/charts/borrow-chart';
import { TimePeriod } from '../components/time-period-selector';

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

// Generate mock stacked area chart data
const generateStackedChartData = (
  days: number,
  tokens: string[],
  minValues: number[],
  maxValues: number[]
): StackedChartDataPoint[] => {
  const dates = generateDates(days);
  const data: StackedChartDataPoint[] = [];
  
  // Initialize current values for each token
  const currentValues = tokens.map((_, i) => 
    minValues[i] + Math.random() * (maxValues[i] - minValues[i])
  );
  
  dates.forEach((date, dateIndex) => {
    const dataPoint: StackedChartDataPoint = { date };
    
    tokens.forEach((token, tokenIndex) => {
      // Update value with some randomness but maintain a trend
      if (dateIndex > 0) {
        const direction = Math.random() > 0.3 ? 1 : -1;
        const change = (Math.random() * 0.05 + 0.01) * currentValues[tokenIndex];
        currentValues[tokenIndex] = Math.max(
          minValues[tokenIndex], 
          Math.min(maxValues[tokenIndex], currentValues[tokenIndex] + direction * change)
        );
        
        // Add some plateaus and jumps
        if (dateIndex % 7 === 0 && Math.random() > 0.7) {
          const jumpDirection = Math.random() > 0.6 ? 1 : -1;
          const jumpSize = (Math.random() * 0.1 + 0.05) * currentValues[tokenIndex];
          currentValues[tokenIndex] = Math.max(
            minValues[tokenIndex], 
            Math.min(maxValues[tokenIndex], currentValues[tokenIndex] + jumpDirection * jumpSize)
          );
        }
      }
      
      dataPoint[token] = Math.round(currentValues[tokenIndex]);
    });
    
    data.push(dataPoint);
  });
  
  return data;
};

// Generate data for different time periods
const generateDataForPeriods = <T>(
  generator: (days: number, ...args: unknown[]) => T[],
  args: unknown[]
): Record<TimePeriod, T[]> => {
  return {
    '1D': generator(1, ...args),
    '1W': generator(7, ...args),
    '1M': generator(30, ...args),
    'All': generator(90, ...args)
  };
};

// Mock data for protocol insights
export const getProtocolInsightsData = () => {
  // Total Value Locked data
  const tvlData = generateDataForPeriods(
    generateLineChartData,
    [10000, 800000, 'up', 768.86]
  );
  
  // Borrow data
  const borrowTokens = ['USDC', 'USDT', 'wBTC', 'wETH'];
  const borrowColors = ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6'];
  const borrowTokenData = borrowTokens.map((symbol, index) => ({
    symbol,
    color: borrowColors[index]
  }));
  
  const borrowData = generateDataForPeriods(
    generateStackedChartData,
    [
      borrowTokens,
      [1000, 800, 500, 1200],
      [5000, 4000, 2500, 6000]
    ]
  );
  
  // Utilisation data
  const utilisationData = generateDataForPeriods(
    generateLineChartData,
    [50, 100, 'stable', 92.8]
  );
  
  // Supply APR data
  const supplyAprData = generateDataForPeriods(
    generateLineChartData,
    [5, 100, 'volatile', 98.345]
  );
  
  // Borrow APR data
  const borrowAprData = generateDataForPeriods(
    generateLineChartData,
    [10, 60, 'stable', 43.56]
  );
  
  return {
    marketDeposit: 97689.32,
    netApr: 3.476,
    tvl: {
      value: 768.86,
      data: tvlData
    },
    borrow: {
      value: 7568.87,
      tokens: borrowTokenData,
      data: borrowData
    },
    utilisation: {
      value: 92.8,
      data: utilisationData
    },
    supplyApr: {
      value: 98.345,
      data: supplyAprData
    },
    borrowApr: {
      value: 43.56,
      data: borrowAprData
    }
  };
};
