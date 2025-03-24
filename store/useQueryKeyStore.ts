import { create } from 'zustand';

/**
 * Store to manage query keys for various data fetching operations
 * This allows us to reference and potentially invalidate queries from anywhere in the app
 */
interface QueryKeyState {
	// Supply market data query keys
	supplyMarketDataQueryKey: readonly unknown[];
	supplyMarketOverviewQueryKey: readonly unknown[];

	// Actions
	setSupplyMarketDataQueryKey: (queryKey: readonly unknown[]) => void;
	setSupplyMarketOverviewQueryKey: (queryKey: readonly unknown[]) => void;
}

export const useQueryKeyStore = create<QueryKeyState>((set) => ({
	// Initial state
	supplyMarketDataQueryKey: [],
	supplyMarketOverviewQueryKey: [],

	// Actions
	setSupplyMarketDataQueryKey: (queryKey) =>
		set({ supplyMarketDataQueryKey: queryKey }),

	setSupplyMarketOverviewQueryKey: (queryKey) =>
		set({ supplyMarketOverviewQueryKey: queryKey }),
}));
