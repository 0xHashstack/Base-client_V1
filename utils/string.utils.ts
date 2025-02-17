export const joinTwoString = (a: string) => (b: string) => `${a}${b}`;

export const currencyFormat = (num?: string | number | null) => {
	if (num === undefined || num === null) return '$0.00';
	const value = typeof num === 'string' ? parseFloat(num) : num;

	if (isNaN(value)) return '$0.00';

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
