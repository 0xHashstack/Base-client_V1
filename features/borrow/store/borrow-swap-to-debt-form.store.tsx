import { LoanPosition } from '@/types/web3/borrow-market.types';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';
import { Web3Address } from '@/types/web3';

// Define transaction status enum
export enum TransactionStatus {
	IDLE = 'idle',
	TRANSACTION_PROCESSING = 'transactionProcessing',
	TRANSACTION_FAILED = 'transactionFailed',
	TRANSACTION_SUCCESS = 'transactionSuccess',
}

// Define the store state and actions
interface BorrowSwapToDebtFormState {
	amount: string;
	marketLoan: LoanPosition | null;
	transactionStatus: TransactionStatus;
	selectedToken: {
		address: Web3Address;
		symbol: string;
		decimals: number;
	} | null;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setMarketLoan: (
		marketLoan: BorrowSwapToDebtFormState['marketLoan']
	) => void;
	setTransactionStatus: (status: TransactionStatus) => void;
	setSelectedToken: (
		token: BorrowSwapToDebtFormState['selectedToken']
	) => void;
	reset: () => void;
	resetStore: (
		newMarketLoan?: BorrowSwapToDebtFormState['marketLoan']
	) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	marketLoan: null,
	transactionStatus: TransactionStatus.IDLE,
	selectedToken: null,
};

// Create a Zustand store
const createBorrowSwapToDebtFormStore = (
	initialMarket: BorrowSwapToDebtFormState['marketLoan'] = null
) =>
	create<BorrowSwapToDebtFormState>((set) => ({
		...initialState,
		marketLoan: initialMarket,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' }); // This would be replaced with actual balance logic
		},
		setMarketLoan: (marketLoan) => set({ marketLoan }),
		setTransactionStatus: (status) => set({ transactionStatus: status }),
		setSelectedToken: (token) => set({ selectedToken: token }),
		reset: () => set({ ...initialState, marketLoan: null }),
		resetStore: (marketLoan) =>
			set({
				...initialState,
				marketLoan:
					marketLoan !== undefined ? marketLoan : initialMarket,
			}),
	}));

// Create a React context for the store
const BorrowSwapToDebtFormStoreContext = createContext<ReturnType<
	typeof createBorrowSwapToDebtFormStore
> | null>(null);

// Provider component
interface BorrowSwapToDebtFormProviderProps {
	children: React.ReactNode;
	initialMarket: BorrowSwapToDebtFormState['marketLoan'];
}

export const BorrowSwapToDebtFormProvider = ({
	children,
	initialMarket,
}: BorrowSwapToDebtFormProviderProps) => {
	const storeRef = useRef<ReturnType<
		typeof createBorrowSwapToDebtFormStore
	> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createBorrowSwapToDebtFormStore(initialMarket);
	}

	// Update the market loan when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new market loan
			storeRef.current.getState().resetStore(initialMarket);
		}
	}, [initialMarket]);

	return (
		<BorrowSwapToDebtFormStoreContext.Provider value={storeRef.current}>
			{children}
		</BorrowSwapToDebtFormStoreContext.Provider>
	);
};

// Hook to use the store
export function useBorrowSwapToDebtFormStore<T>(
	selector: (state: BorrowSwapToDebtFormState) => T
): T {
	const store = useContext(BorrowSwapToDebtFormStoreContext);
	if (!store) {
		throw new Error(
			'useBorrowSwapToDebtFormStore must be used within a BorrowSwapToDebtFormProvider'
		);
	}
	return useStore(store, selector);
}
