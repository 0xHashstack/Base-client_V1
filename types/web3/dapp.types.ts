export type L3Dapp = {
	name: string;
	symbol: string;
	pools: L3DappPool[];
	logoURI: string;
};

export type L3DappPool = {
	key: string;
	name: string;
};
