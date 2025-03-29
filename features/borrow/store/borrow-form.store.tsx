import {
	BorrowMarketCollateral,
	MarketLoan,
} from '@/types/web3/borrow-market.types';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface BorrowFormState {
	amount: string;
	isLoading: boolean;
	collateralMarket: BorrowMarketCollateral | null;
	borrowMarket: MarketLoan | null;
	borrowAmount: string;

	// Actions
	setAmount: (amount: string) => void;
	setCollateralMarket: (token: BorrowFormState['collateralMarket']) => void;
	setBorrowMarket: (borrowMarket: BorrowFormState['borrowMarket']) => void;
	setBorrowAmount: (amount: string) => void;
	setBorrowMaxAmount: () => void;
	setIsLoading: (isLoading: boolean) => void;
	reset: () => void;
	resetStore: (newBorrowMarket?: BorrowFormState['borrowMarket']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	collateralMarket: null,
	borrowMarket: null,
	borrowAmount: '',
};

// Create a Zustand store
const createBorrowFormStore = (initialBorrowMarket: MarketLoan | null = null) =>
	create<BorrowFormState>((set) => ({
		...initialState,
		borrowMarket: initialBorrowMarket,
		setAmount: (amount) => set({ amount }),
		setCollateralMarket: (token) => set({ collateralMarket: token }),
		setBorrowMarket: (borrowMarket) => set({ borrowMarket }),
		setBorrowAmount: (borrowAmount) => set({ borrowAmount }),
		setBorrowMaxAmount: () => {
			set({ borrowAmount: '5000' }); // This would be replaced with actual reserve logic
		},
		setIsLoading: (isLoading) => set({ isLoading }),
		reset: () =>
			set({
				...initialState,
				borrowMarket: initialBorrowMarket,
			}),
		resetStore: (newBorrowMarket) =>
			set({
				...initialState,
				borrowMarket:
					newBorrowMarket !== undefined ? newBorrowMarket : (
						initialBorrowMarket
					),
			}),
	}));

// Create a React context for the store
const BorrowFormStoreContext = createContext<ReturnType<
	typeof createBorrowFormStore
> | null>(null);

// Provider component
interface BorrowFormProviderProps {
	children: React.ReactNode;
	initialBorrowMarket: MarketLoan | null;
}

export const BorrowFormProvider = ({
	children,
	initialBorrowMarket = null,
}: BorrowFormProviderProps) => {
	const storeRef = useRef<ReturnType<typeof createBorrowFormStore> | null>(
		null
	);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createBorrowFormStore(initialBorrowMarket);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialBorrowMarket);
		}
	}, [initialBorrowMarket]);

	return (
		<BorrowFormStoreContext.Provider value={storeRef.current}>
			{children}
		</BorrowFormStoreContext.Provider>
	);
};

// Hook to use the store
export const useBorrowFormStore = <T,>(
	selector: (state: BorrowFormState) => T
): T => {
	const store = useContext(BorrowFormStoreContext);
	if (!store) {
		throw new Error(
			'useBorrowFormStore must be used within a BorrowFormProvider'
		);
	}
	return useStore(store, selector);
};
