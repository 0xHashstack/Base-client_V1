'use client';
import { CURRENT_NETWORK } from './env.constant';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import Web3DataProvider from '@/lib/config/web3';
import IntermediateModel from '@/lib/model/intermediate.model';
import { cookieStorage, createStorage } from 'wagmi';
import { HSTK_WAGMI_COOKIE_KEY } from './keys.constant';
import { Web3Address } from '@/types/web3';

// declare module 'wagmi' {
// 	interface Register {
// 		config: typeof web3Config;
// 	}
// }

export const web3DataProvider = new Web3DataProvider(CURRENT_NETWORK);
export const intermediateContract = new IntermediateModel(
	web3DataProvider.intermediateAddress as Web3Address
);

export const initializeWeb3Config = (web3Provider: Web3DataProvider) => {
	const baseChain = web3Provider.baseChain;

	return getDefaultConfig({
		appName: 'HSTK Base',
		projectId: web3Provider.walletConnectProjectId,
		chains: [baseChain],
		ssr: true,
		transports: {
			[baseChain.id]: web3Provider.baseTransport,
		},
		storage: createStorage({
			key: HSTK_WAGMI_COOKIE_KEY,
			storage: cookieStorage,
		}),
	});
};

export const web3Config = initializeWeb3Config(web3DataProvider);
