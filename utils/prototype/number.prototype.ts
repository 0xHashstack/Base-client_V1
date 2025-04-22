declare global {
	interface Number {
		toFixedDecimals(precision?: number): string;
	}
}

// Add formatDecimals method to Number prototype if it doesn't exist already
if (typeof Number.prototype.toFixedDecimals !== 'function') {
	Number.prototype.toFixedDecimals = function (precision = 3) {
		try {
			// Get the number value
			const value = this.valueOf();

			// Check if the number has decimal places
			if (Number.isInteger(value)) {
				// If it's an integer, format with exactly the specified decimal places
				return value.toFixed(precision);
			} else {
				// If it already has decimals, return it as is
				return value.toString();
			}
		} catch {
			// Return a default value in case of errors
			return '0.' + '0'.repeat(precision);
		}
	};
}

// This export is needed to ensure the file is properly imported as a module
export {};
