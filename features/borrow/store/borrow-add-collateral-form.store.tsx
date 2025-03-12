import { CollateralToken } from '@/types/web3';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface BorrowAddCollateralFormState {
	amount: string;
	isLoading: boolean;
	token: CollateralToken | null;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setToken: (token: BorrowAddCollateralFormState['token']) => void;
	setIsLoading: (isLoading: boolean) => void;
	reset: () => void;
	resetStore: (newToken?: BorrowAddCollateralFormState['token']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	token: null,
};

// Create a Zustand store
const createBorrowAddCollateralFormStore = (
	initialToken: BorrowAddCollateralFormState['token'] = null
) =>
	create<BorrowAddCollateralFormState>((set) => ({
		...initialState,
		token: initialToken,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' }); // This would be replaced with actual balance logic
		},
		setToken: (token) => set({ token }),
		setIsLoading: (isLoading) => set({ isLoading }),
		reset: () => set({ ...initialState, token: initialToken }),
		resetStore: (newToken) =>
			set({
				...initialState,
				token: newToken !== undefined ? newToken : initialToken,
			}),
	}));

// Create a React context for the store
const BorrowAddCollateralFormStoreContext = createContext<ReturnType<
	typeof createBorrowAddCollateralFormStore
> | null>(null);

// Provider component
interface BorrowAddCollateralFormProviderProps {
	children: React.ReactNode;
	initialToken: BorrowAddCollateralFormState['token'];
}

export const BorrowAddCollateralFormProvider = ({
	children,
	initialToken,
}: BorrowAddCollateralFormProviderProps) => {
	const storeRef = useRef<ReturnType<
		typeof createBorrowAddCollateralFormStore
	> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createBorrowAddCollateralFormStore(initialToken);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialToken);
		}
	}, [initialToken]);

	return (
		<BorrowAddCollateralFormStoreContext.Provider value={storeRef.current}>
			{children}
		</BorrowAddCollateralFormStoreContext.Provider>
	);
};

// Hook to use the store
export const useBorrowAddCollateralFormStore = <T,>(
	selector: (state: BorrowAddCollateralFormState) => T
): T => {
	const store = useContext(BorrowAddCollateralFormStoreContext);
	if (!store) {
		throw new Error(
			'useBorrowAddCollateralFormStore must be used within a BorrowAddCollateralFormProvider'
		);
	}
	return useStore(store, selector);
};
