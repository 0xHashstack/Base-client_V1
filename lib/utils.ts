import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 * @param value The number to format
 * @param currency The currency symbol to use (default: $)
 * @param decimals The number of decimal places to show (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
	value: number,
	currency = '$',
	decimals = 2
): string {
	return `${currency}${value.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})}`;
}
