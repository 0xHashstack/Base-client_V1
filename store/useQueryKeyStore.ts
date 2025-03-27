import { create } from 'zustand';

/**
 * Store to manage query keys for various data fetching operations
 * This allows us to reference and potentially invalidate queries from anywhere in the app
 */
interface QueryKeyState {
	// Supply market data query keys
	supplyMarketDataQueryKey: readonly unknown[];
	supplyMarketOverviewQueryKey: readonly unknown[];

	// Borrow market data query keys
	borrowMarketDataQueryKey: readonly unknown[];
	borrowMarketOverviewQueryKey: readonly unknown[];

	// Actions
	setSupplyMarketDataQueryKey: (queryKey: readonly unknown[]) => void;
	setSupplyMarketOverviewQueryKey: (queryKey: readonly unknown[]) => void;
	setBorrowMarketDataQueryKey: (queryKey: readonly unknown[]) => void;
	setBorrowMarketOverviewQueryKey: (queryKey: readonly unknown[]) => void;
}

export const useQueryKeyStore = create<QueryKeyState>((set) => ({
	// Initial state
	supplyMarketDataQueryKey: [],
	supplyMarketOverviewQueryKey: [],
	borrowMarketDataQueryKey: [],
	borrowMarketOverviewQueryKey: [],

	// Actions
	setSupplyMarketDataQueryKey: (queryKey) =>
		set({ supplyMarketDataQueryKey: queryKey }),

	setSupplyMarketOverviewQueryKey: (queryKey) =>
		set({ supplyMarketOverviewQueryKey: queryKey }),

	setBorrowMarketDataQueryKey: (queryKey) =>
		set({ borrowMarketDataQueryKey: queryKey }),

	setBorrowMarketOverviewQueryKey: (queryKey) =>
		set({ borrowMarketOverviewQueryKey: queryKey }),
}));
