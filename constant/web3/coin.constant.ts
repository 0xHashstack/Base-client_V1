import { HstkCoin } from '@/types/web3/coin.types';
import { ICON } from '../assets/assets.constnat';

export const BASE_SEPOLIA_COINS: HstkCoin[] = [
	{
		name: 'USDT',
		symbol: 'USDT',
		address: '0xBFe0DEd54fd3a6F39ed0237B450440485e94c45e',
		decimals: 6,
		iconUrl: ICON.USDT,
	},
	{
		name: 'USDC',
		symbol: 'USDC',
		address: '0xb78D347a421c80f5815C6d7f527236f132FDc1BF',
		decimals: 6,
		iconUrl: ICON.USDC,
	},
	{
		name: 'DAI',
		symbol: 'DAI',
		address: '0x984536E67FA3A9164472FAD2DD56BD82530ab088',
		decimals: 18,
		iconUrl: ICON.DAI,
	},
];

export const BASE_MAINNET_COINS: HstkCoin[] = [
	{
		name: 'USDT',
		symbol: 'USDT',
		address: '0xBFe0DEd54fd3a6F39ed0237B450440485e94c45e',
		decimals: 6,
		iconUrl: ICON.USDT,
	},
	{
		name: 'USDC',
		symbol: 'USDC',
		address: '0xb78D347a421c80f5815C6d7f527236f132FDc1BF',
		decimals: 6,
		iconUrl: ICON.USDC,
	},
	{
		name: 'DAI',
		symbol: 'DAI',
		address: '0x984536E67FA3A9164472FAD2DD56BD82530ab088',
		decimals: 18,
		iconUrl: ICON.DAI,
	},
];
