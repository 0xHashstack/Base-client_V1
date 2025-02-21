import { HstkToken } from '@/types/web3/token.types';

export const BASE_SEPOLIA_TOKENS: HstkToken[] = [
	{
		name: 'MockUSDT',
		symbol: 'MUSDT',
		address: '0x63dc4f8f48dDb5f22e2f231aEBcE5ff803E622DC',
		decimals: 6,
		iconUrl: '/icons/coins/USDT.svg',
	},
	{
		name: 'MockUSDC',
		symbol: 'USDC',
		address: '0x6c84E17dd0F87C22eE13d50C35d441Ff1AaFd6dD',
		decimals: 6,
		iconUrl: '/icons/coins/USDC.svg',
		isNew: true,
	},
	{
		name: 'MockDAI',
		symbol: 'MDAI',
		address: '0x8c65852bC6b1Cd8e94597fB31c2847390E5062bc',
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
