import { CollateralToken, HstkToken } from '@/types/web3/token.types';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface BorrowFormState {
	amount: string;
	isLoading: boolean;
	token: CollateralToken | null;
	borrowMarket: HstkToken | null;
	borrowAmount: string;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setToken: (token: BorrowFormState['token']) => void;
	setBorrowMarket: (token: HstkToken | null) => void;
	setBorrowAmount: (amount: string) => void;
	setBorrowMaxAmount: () => void;
	setIsLoading: (isLoading: boolean) => void;
	reset: () => void;
	resetStore: (newToken?: BorrowFormState['token'], newBorrowMarket?: HstkToken | null) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	token: null,
	borrowMarket: null,
	borrowAmount: '',
};

// Create a Zustand store
const createBorrowFormStore = (
	initialToken: BorrowFormState['token'] = null,
	initialBorrowMarket: HstkToken | null = null
) =>
	create<BorrowFormState>((set) => ({
		...initialState,
		token: initialToken,
		borrowMarket: initialBorrowMarket,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' }); // This would be replaced with actual balance logic
		},
		setToken: (token) => set({ token }),
		setBorrowMarket: (borrowMarket) => set({ borrowMarket }),
		setBorrowAmount: (borrowAmount) => set({ borrowAmount }),
		setBorrowMaxAmount: () => {
			set({ borrowAmount: '5000' }); // This would be replaced with actual reserve logic
		},
		setIsLoading: (isLoading) => set({ isLoading }),
		reset: () => set({ ...initialState, token: initialToken, borrowMarket: initialBorrowMarket }),
		resetStore: (newToken, newBorrowMarket) =>
			set({
				...initialState,
				token: newToken !== undefined ? newToken : initialToken,
				borrowMarket: newBorrowMarket !== undefined ? newBorrowMarket : initialBorrowMarket,
			}),
	}));

// Create a React context for the store
const BorrowFormStoreContext = createContext<ReturnType<
	typeof createBorrowFormStore
> | null>(null);

// Provider component
interface BorrowFormProviderProps {
	children: React.ReactNode;
	initialToken: BorrowFormState['token'];
	initialBorrowMarket?: HstkToken | null;
}

export const BorrowFormProvider = ({
	children,
	initialToken,
	initialBorrowMarket = null,
}: BorrowFormProviderProps) => {
	const storeRef = useRef<ReturnType<
		typeof createBorrowFormStore
	> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createBorrowFormStore(initialToken, initialBorrowMarket);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialToken, initialBorrowMarket);
		}
	}, [initialToken, initialBorrowMarket]);

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
