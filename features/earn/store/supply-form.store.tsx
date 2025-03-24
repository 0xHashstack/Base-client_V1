import { SupplyMarketData } from '@/types/web3/supply-market.types';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define transaction status enum
export enum TransactionStatus {
	IDLE = 'idle',
	APPROVING = 'approving',
	APPROVED = 'approved',
	TRANSACTION_PROCESSING = 'transactionProcessing',
	TRANSACTION_FAILED = 'transactionFailed',
	TRANSACTION_SUCCESS = 'transactionSuccess',
}

// Define the store state and actions
interface SupplyFormState {
	amount: string;
	isLoading: boolean;
	market: SupplyMarketData | null;
	transactionStatus: TransactionStatus;

	// Actions
	setAmount: (amount: string) => void;
	setMarket: (market: SupplyFormState['market']) => void;
	setIsLoading: (isLoading: boolean) => void;
	setTransactionStatus: (status: TransactionStatus) => void;

	reset: () => void;
	resetStore: (newMarket?: SupplyFormState['market']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	market: null,
	transactionStatus: TransactionStatus.IDLE,
};

// Create a Zustand store
const createSupplyFormStore = (
	initialMarket: SupplyFormState['market'] = null
) =>
	create<SupplyFormState>((set, get) => ({
		...initialState,
		market: initialMarket,
		setAmount: (amount) => set({ amount }),
		setMarket: (market) => {
			get().resetStore(market);
		},
		setIsLoading: (isLoading) => set({ isLoading }),
		setTransactionStatus: (status) => set({ transactionStatus: status }),

		reset: () => set({ ...initialState, market: initialMarket }),
		resetStore: (newMarket) =>
			set({
				...initialState,
				market: newMarket !== undefined ? newMarket : initialMarket,
			}),
	}));

// Create a React context for the store
const SupplyFormStoreContext = createContext<ReturnType<
	typeof createSupplyFormStore
> | null>(null);

// Provider component
interface SupplyFormProviderProps {
	children: React.ReactNode;
	initialMarket: SupplyFormState['market'];
}

export const SupplyFormProvider = ({
	children,
	initialMarket,
}: SupplyFormProviderProps) => {
	const storeRef = useRef<ReturnType<typeof createSupplyFormStore> | null>(
		null
	);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createSupplyFormStore(initialMarket);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialMarket);
		}
	}, [initialMarket]);

	return (
		<SupplyFormStoreContext.Provider value={storeRef.current}>
			{children}
		</SupplyFormStoreContext.Provider>
	);
};

// Hook to use the store
export const useSupplyFormStore = <T,>(
	selector: (state: SupplyFormState) => T
): T => {
	const store = useContext(SupplyFormStoreContext);
	if (!store) {
		throw new Error(
			'useSupplyFormStore must be used within a SupplyFormProvider'
		);
	}
	return useStore(store, selector);
};
