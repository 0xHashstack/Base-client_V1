import { LoanPosition } from '@/types/web3/borrow-market.types';
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
interface BorrowRepayFormState {
	amount: string;
	isLoading: boolean;
	marketLoan: LoanPosition | null;
	fee: string;
	transactionStatus: TransactionStatus;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setMarketLoan: (marketLoan: BorrowRepayFormState['marketLoan']) => void;
	setIsLoading: (isLoading: boolean) => void;
	setFee: (fee: string) => void;
	setTransactionStatus: (status: TransactionStatus) => void;
	reset: () => void;
	resetStore: (newMarketLoan?: BorrowRepayFormState['marketLoan']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	marketLoan: null,
	fee: '0.00',
	transactionStatus: TransactionStatus.IDLE,
};

// Create a Zustand store
const createBorrowRepayFormStore = (
	initialMarket: BorrowRepayFormState['marketLoan'] = null
) =>
	create<BorrowRepayFormState>((set) => ({
		...initialState,
		marketLoan: initialMarket,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' }); // This would be replaced with actual balance logic
		},
		setMarketLoan: (marketLoan) => set({ marketLoan }),
		setIsLoading: (isLoading) => set({ isLoading }),
		setFee: (fee) => set({ fee }),
		setTransactionStatus: (status) => set({ transactionStatus: status }),
		reset: () => set({ ...initialState, marketLoan: initialMarket }),
		resetStore: (marketLoan) =>
			set({
				...initialState,
				marketLoan:
					marketLoan !== undefined ? marketLoan : initialMarket,
			}),
	}));

// Create a React context for the store
const BorrowRepayFormStoreContext = createContext<ReturnType<
	typeof createBorrowRepayFormStore
> | null>(null);

// Provider component
interface BorrowRepayFormProviderProps {
	children: React.ReactNode;
	initialMarket: BorrowRepayFormState['marketLoan'];
}

export const BorrowRepayFormProvider = ({
	children,
	initialMarket,
}: BorrowRepayFormProviderProps) => {
	const storeRef = useRef<ReturnType<
		typeof createBorrowRepayFormStore
	> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createBorrowRepayFormStore(initialMarket);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialMarket);
		}
	}, [initialMarket]);

	return (
		<BorrowRepayFormStoreContext.Provider value={storeRef.current}>
			{children}
		</BorrowRepayFormStoreContext.Provider>
	);
};

// Hook to use the store
export const useBorrowRepayFormStore = <T,>(
	selector: (state: BorrowRepayFormState) => T
): T => {
	const store = useContext(BorrowRepayFormStoreContext);
	if (!store) {
		throw new Error(
			'useBorrowRepayFormStore must be used within a BorrowRepayFormProvider'
		);
	}
	return useStore(store, selector);
};
