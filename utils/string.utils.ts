export const joinTwoString = (a: string) => (b: string) => `${a}${b}`;

export const currencyFormat = (num?: string | number | null) => {
	if (num === undefined || num === null) return '$0.00';
	const value = typeof num === 'string' ? parseFloat(num) : num;

	if (isNaN(value)) return '$0.00';

	if (Math.abs(value) >= 1e12) {
		// Trillions
		const inTrillions = value / 1e12;
		return `${inTrillions.toFixed(inTrillions % 1 !== 0 ? 3 : 2)}T`;
	} else if (Math.abs(value) >= 1e9) {
		// Billions
		const inBillions = value / 1e9;
		return `${inBillions.toFixed(inBillions % 1 !== 0 ? 3 : 2)}B`;
	} else if (Math.abs(value) >= 1e6) {
		// Millions
		const inMillions = value / 1e6;
		return `${inMillions.toFixed(inMillions % 1 !== 0 ? 3 : 2)}M`;
	} else if (Math.abs(value) >= 1e3) {
		// Thousands
		const inThousands = value / 1e3;
		return `${inThousands.toFixed(inThousands % 1 !== 0 ? 3 : 2)}K`;
	} else {
		// Regular dollars
		return `${value.toFixed(value % 1 !== 0 ? 3 : 2)}`;
	}
};
