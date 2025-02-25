export enum SpendCategory {
	Swap = 'Swap',
	LiquidityProvisioning = 'Liquidity Provisioning',
	Supply = 'Supply',
}

export type CurrentDebt = {
	dappName: string;
	dappIcon?: string;
	spendCategory: SpendCategory;
	value: number;
	assetName: string;
};
