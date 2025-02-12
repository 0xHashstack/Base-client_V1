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
