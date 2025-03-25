import { SupplyPosition } from '@/types/web3/supply-market.types';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define transaction status enum
export enum TransactionStatus {
	IDLE = 'idle',
	TRANSACTION_PROCESSING = 'transactionProcessing',
	TRANSACTION_FAILED = 'transactionFailed',
	TRANSACTION_SUCCESS = 'transactionSuccess',
}

// Define the store state and actions
interface SupplyWithdrawFormState {
	amount: string;
	isLoading: boolean;
	supplyPosition: SupplyPosition | null;
	transactionStatus: TransactionStatus;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setSupplyPosition: (
		token: SupplyWithdrawFormState['supplyPosition']
	) => void;
	setIsLoading: (isLoading: boolean) => void;
	setTransactionStatus: (status: TransactionStatus) => void;
	reset: () => void;
	resetStore: (newToken?: SupplyWithdrawFormState['supplyPosition']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	token: null,
	transactionStatus: TransactionStatus.IDLE,
};

// Create a Zustand store
const createSupplyWithdrawFormStore = (
	initialSupply: SupplyWithdrawFormState['supplyPosition'] = null
) =>
	create<SupplyWithdrawFormState>((set, get) => ({
		...initialState,
		supplyPosition: initialSupply,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' }); // This would be replaced with actual balance logic
		},
		setSupplyPosition: (token) => get().resetStore(token),
		setIsLoading: (isLoading) => set({ isLoading }),
		setTransactionStatus: (status) => set({ transactionStatus: status }),
		reset: () => set({ ...initialState, supplyPosition: initialSupply }),
		resetStore: (newToken) =>
			set({
				...initialState,
				supplyPosition:
					newToken !== undefined ? newToken : initialSupply,
			}),
	}));

// Create a React context for the store
const SupplyWithdrawFormStoreContext = createContext<ReturnType<
	typeof createSupplyWithdrawFormStore
> | null>(null);

// Provider component
interface SupplyWithdrawFormProviderProps {
	children: React.ReactNode;
	initialPosition: SupplyWithdrawFormState['supplyPosition'];
}

export const SupplyWithdrawFormProvider = ({
	children,
	initialPosition,
}: SupplyWithdrawFormProviderProps) => {
	const storeRef = useRef<ReturnType<
		typeof createSupplyWithdrawFormStore
	> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createSupplyWithdrawFormStore(initialPosition);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialPosition);
		}
	}, [initialPosition]);

	return (
		<SupplyWithdrawFormStoreContext.Provider value={storeRef.current}>
			{children}
		</SupplyWithdrawFormStoreContext.Provider>
	);
};

// Hook to use the store
export const useSupplyWithdrawFormStore = <T,>(
	selector: (state: SupplyWithdrawFormState) => T
): T => {
	const store = useContext(SupplyWithdrawFormStoreContext);
	if (!store) {
		throw new Error(
			'useSupplyWithdrawFormStore must be used within a SupplyWithdrawFormProvider'
		);
	}
	return useStore(store, selector);
};
