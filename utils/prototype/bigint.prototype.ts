import { formatUnits } from 'viem';

declare global {
	interface BigInt {
		/**
		 * Format bigint value with proper decimals and suffixes (K, M, B)
		 * @param decimals - Number of decimals to format with
		 * @param options - Additional formatting options
		 * @returns Formatted string value with appropriate suffix
		 */
		formatBalance(decimals: number, options?: { toFixed: number }): string;

		/**
		 * Format bigint value to a locale string number
		 * @param decimals - Number of decimals to format with
		 * @param locale - Locale for number formatting (default: 'en-US')
		 * @param options - Additional Intl.NumberFormat options
		 * @returns Formatted locale string value
		 */
		formatToString(
			decimals: number,
			locale?: string,
			options?: Intl.NumberFormatOptions
		): string;

		/**
		 * Format bigint value to a locale string number
		 * @param decimals - Number of decimals to format with
		 * @returns Formatted locale string value
		 */
		format(decimals: number): number;
	}
}

// Add formatBalance method to BigInt prototype if it doesn't exist already
if (typeof BigInt.prototype.formatBalance !== 'function') {
	BigInt.prototype.formatBalance = function (
		decimals: number,
		{ toFixed }: { toFixed: number } = { toFixed: 2 }
	): string {
		try {
			// Convert 'this' to a bigint value explicitly
			const value = BigInt(this.toString());
			const formatted = parseFloat(formatUnits(value, decimals));

			// Format with appropriate suffix
			if (Math.abs(formatted) >= 1e12) {
				// Trillions
				const inTrillions = formatted / 1e12;
				return `${inTrillions.toFixed(inTrillions % 1 !== 0 ? 3 : toFixed)}T`;
			} else if (Math.abs(formatted) >= 1e9) {
				// Billions
				const inBillions = formatted / 1e9;
				return `${inBillions.toFixed(inBillions % 1 !== 0 ? 3 : toFixed)}B`;
			} else if (Math.abs(formatted) >= 1e6) {
				// Millions
				const inMillions = formatted / 1e6;
				return `${inMillions.toFixed(inMillions % 1 !== 0 ? 3 : toFixed)}M`;
			} else if (Math.abs(formatted) >= 1e3) {
				// Thousands
				const inThousands = formatted / 1e3;
				return `${inThousands.toFixed(inThousands % 1 !== 0 ? 3 : toFixed)}K`;
			} else {
				// Regular dollars
				return `${formatted.toFixed(formatted % 1 !== 0 ? 3 : toFixed)}`;
			}
		} catch {
			return '0.00';
		}
	};
}

// Add formatToString method to BigInt prototype if it doesn't exist already
if (typeof BigInt.prototype.formatToString !== 'function') {
	BigInt.prototype.formatToString = function (
		decimals: number,
		locale: string = 'en-US',
		options: Intl.NumberFormatOptions = { maximumFractionDigits: 6 }
	): string {
		try {
			// Convert 'this' to a bigint value explicitly
			const value = BigInt(this.toString());
			const formatted = parseFloat(formatUnits(value, decimals));
			return formatted.toLocaleString(locale, options);
		} catch {
			return '0';
		}
	};
}

// Add formatToString method to BigInt prototype if it doesn't exist already
if (typeof BigInt.prototype.format !== 'function') {
	BigInt.prototype.format = function (decimals: number): number {
		try {
			// Convert 'this' to a bigint value explicitly
			const value = BigInt(this.toString());
			const formatted = formatUnits(value, decimals);
			return parseFloat(formatted);
		} catch {
			return 0;
		}
	};
}

// This export is needed to ensure the file is properly imported as a module
export {};
