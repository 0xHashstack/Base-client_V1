import { HstkToken } from '@/types/web3/token.types';

export const BASE_SEPOLIA_TOKENS: HstkToken[] = [
	{
		name: 'USDT',
		symbol: 'USDT',
		address: '0xBFe0DEd54fd3a6F39ed0237B450440485e94c45e',
		decimals: 6,
		iconUrl: '/icons/coins/USDT.svg',
	},
	{
		name: 'USDC',
		symbol: 'USDC',
		address: '0xb78D347a421c80f5815C6d7f527236f132FDc1BF',
		decimals: 6,
		iconUrl: '/icons/coins/USDC.svg',
		isNew: true,
	},
	{
		name: 'DAI',
		symbol: 'DAI',
		address: '0x984536E67FA3A9164472FAD2DD56BD82530ab088',
		decimals: 18,
		iconUrl: '/icons/coins/DAI.svg',
		isPaused: true,
	},
];

export const BASE_MAINNET_TOKENS: HstkToken[] = [
	{
		name: 'USDT',
		symbol: 'USDT',
		address: '0xBFe0DEd54fd3a6F39ed0237B450440485e94c45e',
		decimals: 6,
		iconUrl: '/icons/coins/USDT.svg',
	},
	{
		name: 'USDC',
		symbol: 'USDC',
		address: '0xb78D347a421c80f5815C6d7f527236f132FDc1BF',
		decimals: 6,
		iconUrl: '/icons/coins/USDC.svg',
		isNew: true,
	},
	{
		name: 'DAI',
		symbol: 'DAI',
		address: '0x984536E67FA3A9164472FAD2DD56BD82530ab088',
		decimals: 18,
		iconUrl: '/icons/coins/DAI.svg',
		isPaused: true,
	},
];
