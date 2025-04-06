import { L3Dapp } from '@/types/web3/dapp.types';

export const L3_DAPP: L3Dapp[] = [
	{
		name: 'Aave',
		symbol: 'aave',
		logoURI: 'https://cryptologos.cc/logos/aave-aave-logo.png',
		pools: [
			{
				key: 'aave-v3',
				name: 'STRK/ETH',
			},
		],
	},
];
