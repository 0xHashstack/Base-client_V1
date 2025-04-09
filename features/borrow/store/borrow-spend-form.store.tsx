'use client';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import { L3Dapp, L3DappPool } from '@/types/web3/dapp.types';
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

/**
 * Define transaction status enum
 */
export enum TransactionStatus {
	IDLE = 'idle',
	TRANSACTION_PROCESSING = 'transactionProcessing',
	TRANSACTION_FAILED = 'transactionFailed',
	TRANSACTION_SUCCESS = 'transactionSuccess',
}

/**
 * Initial state for the borrow spend form
 */
const initialState = {
	market: null as LoanPosition | null,
	activeTab: 'liquidity' as 'liquidity' | 'swap',
	selectedDapp: null as L3Dapp | null,
	selectedPool: null as L3DappPool | null,
	transactionStatus: TransactionStatus.IDLE,
	validationError: '',
};

/**
 * State shape for the borrow spend form
 */
export interface BorrowSpendFormState {
	// State
	market: LoanPosition | null;
	activeTab: 'liquidity' | 'swap';
	selectedDapp: L3Dapp | null;
	selectedPool: L3DappPool | null;
	transactionStatus: TransactionStatus;
	validationError: string;

	// Actions
	setMarket: (market: LoanPosition | null) => void;
	setActiveTab: (tab: 'liquidity' | 'swap') => void;
	setSelectedDapp: (dapp: L3Dapp | null) => void;
	setSelectedPool: (pool: L3DappPool | null) => void;
	setTransactionStatus: (status: TransactionStatus) => void;
	setValidationError: (error: string) => void;
	reset: () => void;
	resetStore: (newMarket?: LoanPosition | null) => void;
}

/**
 * Create a store factory for the borrow spend form
 * @param initialMarket Initial market token
 * @returns Store instance
 */
export const createBorrowSpendFormStore = (
	initialMarket: LoanPosition | null = null
) => {
	const initialToken = initialMarket;

	return createStore<BorrowSpendFormState>((set) => ({
		...initialState,
		market: initialToken,
		setMarket: (market) =>
			set({ market, selectedDapp: null, selectedPool: null }),
		setActiveTab: (activeTab) => set({ activeTab }),
		setSelectedDapp: (dapp) =>
			set({ selectedDapp: dapp, selectedPool: null }),
		setSelectedPool: (pool) => set({ selectedPool: pool }),
		setTransactionStatus: (transactionStatus) => set({ transactionStatus }),
		setValidationError: (validationError) => set({ validationError }),
		reset: () => set({ ...initialState, market: null }),
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
	initialMarket?: LoanPosition | null;
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
