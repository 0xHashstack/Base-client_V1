'use client';
import { HstkToken } from '@/types/web3/token.types';
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

/**
 * Initial state for the borrow spend form
 */
const initialState = {
	market: null as HstkToken | null,
	isLoading: false,
	activeTab: 'liquidity' as 'liquidity' | 'swap',
};

/**
 * State shape for the borrow spend form
 */
export interface BorrowSpendFormState {
	// State
	market: HstkToken | null;
	isLoading: boolean;
	activeTab: 'liquidity' | 'swap';

	// Actions
	setMarket: (market: HstkToken | null) => void;
	setIsLoading: (isLoading: boolean) => void;
	setActiveTab: (tab: 'liquidity' | 'swap') => void;
	reset: () => void;
	resetStore: (newMarket?: HstkToken | null) => void;
}

/**
 * Create a store factory for the borrow spend form
 * @param initialMarket Initial market token
 * @returns Store instance
 */
export const createBorrowSpendFormStore = (
	initialMarket: HstkToken | null = null
) => {
	const initialToken = initialMarket;

	return createStore<BorrowSpendFormState>((set) => ({
		...initialState,
		market: initialToken,
		setMarket: (market) => set({ market }),
		setIsLoading: (isLoading) => set({ isLoading }),
		setActiveTab: (activeTab) => set({ activeTab }),
		reset: () => set({ ...initialState, market: initialToken }),
		resetStore: (newMarket) =>
			set({
				...initialState,
				market: newMarket !== undefined ? newMarket : initialToken,
			}),
	}));
};

/**
 * Context for the borrow spend form store
 */
export const BorrowSpendFormStoreContext =
	createContext<StoreApi<BorrowSpendFormState> | null>(null);

/**
 * Provider props for the borrow spend form context
 */
export interface BorrowSpendFormProviderProps {
	children: ReactNode;
	initialMarket?: HstkToken | null;
}

/**
 * Provider component for the borrow spend form store
 */
export function BorrowSpendFormProvider({
	children,
	initialMarket = null,
}: BorrowSpendFormProviderProps) {
	// Create a ref to store the store instance
	const storeRef = useRef<StoreApi<BorrowSpendFormState> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createBorrowSpendFormStore(initialMarket);
	}

	// Reset the store when the initial market changes
	useEffect(() => {
		if (storeRef.current) {
			storeRef.current.getState().resetStore(initialMarket);
		}
	}, [initialMarket]);

	return (
		<BorrowSpendFormStoreContext.Provider value={storeRef.current}>
			{children}
		</BorrowSpendFormStoreContext.Provider>
	);
}

/**
 * Hook to access the borrow spend form store
 * @param selector Selector function to pick parts of the state
 * @returns Selected state
 */
export function useBorrowSpendFormStore<T>(
	selector: (state: BorrowSpendFormState) => T
): T {
	const store = useContext(BorrowSpendFormStoreContext);

	if (!store) {
		throw new Error(
			'useBorrowSpendFormStore must be used within a BorrowSpendFormProvider'
		);
	}

	return useStore(store, selector);
}
