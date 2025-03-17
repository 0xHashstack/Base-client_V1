export type L3Dapp = {
	name: string;
	key: string;
	pools: L3DappPool[];
};

export type L3DappPool = {
	key: string;
	name: string;
};
