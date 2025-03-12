import { SuppliedToken } from '@/types/web3';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface SupplyWithdrawFormState {
	amount: string;
	isLoading: boolean;
	token: SuppliedToken | null;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setToken: (token: SupplyWithdrawFormState['token']) => void;
	setIsLoading: (isLoading: boolean) => void;
	reset: () => void;
	resetStore: (newToken?: SupplyWithdrawFormState['token']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	token: null,
};

// Create a Zustand store
const createSupplyWithdrawFormStore = (
	initialToken: SupplyWithdrawFormState['token'] = null
) =>
	create<SupplyWithdrawFormState>((set) => ({
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
const SupplyWithdrawFormStoreContext = createContext<ReturnType<
	typeof createSupplyWithdrawFormStore
> | null>(null);

// Provider component
interface SupplyWithdrawFormProviderProps {
	children: React.ReactNode;
	initialToken: SupplyWithdrawFormState['token'];
}

export const SupplyWithdrawFormProvider = ({
	children,
	initialToken,
}: SupplyWithdrawFormProviderProps) => {
	const storeRef = useRef<ReturnType<
		typeof createSupplyWithdrawFormStore
	> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createSupplyWithdrawFormStore(initialToken);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialToken);
		}
	}, [initialToken]);

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
