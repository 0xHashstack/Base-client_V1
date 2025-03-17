import { web3DataProvider } from '@/constant/config';
import { L3Dapp } from '@/types/web3/dapp.types';
import { create } from 'zustand';

/**
 * State shape
 */
interface L3DappState {
	dapps: L3Dapp[];
	dappsMap: Record<string, L3Dapp>;
	setDapps: (dapps: L3Dapp[]) => void;
}

/**
 * Static state
 * Initialize with dapps and create a map of dapps by key
 */
const staticState: L3DappState = (() => {
	const dapps = web3DataProvider.dapps;
	return {
		dapps,
		dappsMap: dapps.reduce(
			(map, dapp) => {
				map[dapp.key] = dapp;
				return map;
			},
			{} as Record<string, L3Dapp>
		),
		setDapps: () => {},
	};
})();

/**
 * L3Dapp store
 * Used to store and manage L3 dapps data
 */
export const useL3DappStore = create<L3DappState>((set) => ({
	...staticState,
	setDapps: (dapps: L3Dapp[]) => {
		set({
			dapps,
			dappsMap: dapps.reduce(
				(map, dapp) => {
					map[dapp.key] = dapp;
					return map;
				},
				{} as Record<string, L3Dapp>
			),
		});
	},
}));
