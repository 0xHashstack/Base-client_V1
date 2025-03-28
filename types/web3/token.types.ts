export type HstkToken = {
	name: string;
	symbol: string;
	address: string;
	decimals: number;
	iconUrl: string;
	isPaused?: boolean;
	isNew?: boolean;
};

export type CollateralToken = HstkToken & {
	availableCollateral?: number;
};
