import { formatUnits } from 'viem';

/**
 * Format token balance with proper decimals
 * @param value - Raw balance value
 * @param decimals - Token decimals
 * @returns Formatted string value
 */
export const formatTokenBalance = (
	value: bigint | undefined,
	decimals: number = 18
): string => {
	if (!value) return '0';
	try {
		return formatUnits(value, decimals);
	} catch {
		return '0';
	}
};

export const formatToReadableValue = (num?: string | number | null) => {
	if (num === undefined || num === null) return '0.00';
	const value = typeof num === 'string' ? parseFloat(num) : num;

	if (isNaN(value)) return '0.00';

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});

	if (Math.abs(value) >= 1e9) {
		return formatter.format(value / 1e9).replace(/\.0+$/, '') + 'B';
	}

	if (Math.abs(value) >= 1e6) {
		return formatter.format(value / 1e6).replace(/\.0+$/, '') + 'M';
	}

	if (Math.abs(value) >= 1e3) {
		return formatter.format(value / 1e3).replace(/\.0+$/, '') + 'K';
	}

	return formatter.format(value);
};
