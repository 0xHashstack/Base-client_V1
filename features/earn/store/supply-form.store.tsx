import { HstkToken } from '@/types/web3';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface SupplyFormState {
	amount: string;
	isLoading: boolean;
	token: HstkToken | null;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setToken: (token: SupplyFormState['token']) => void;
	setIsLoading: (isLoading: boolean) => void;
	reset: () => void;
	resetStore: (newToken?: SupplyFormState['token']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	token: null,
};

// Create a Zustand store
const createSupplyFormStore = (initialToken: SupplyFormState['token'] = null) =>
	create<SupplyFormState>((set) => ({
		...initialState,
		token: initialToken,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' });
		},
		setToken: (token) => set({ token }),
		setIsLoading: (isLoading) => set({ isLoading }),
		reset: () => set({ ...initialState, token: initialToken }),
		resetStore: (newToken) => set({ 
			...initialState, 
			token: newToken !== undefined ? newToken : initialToken 
		}),
	}));

// Create a React context for the store
const SupplyFormStoreContext = createContext<ReturnType<
	typeof createSupplyFormStore
> | null>(null);

// Provider component
interface SupplyFormProviderProps {
	children: React.ReactNode;
	initialToken: SupplyFormState['token'];
}

export const SupplyFormProvider = ({
	children,
	initialToken,
}: SupplyFormProviderProps) => {
	const storeRef = useRef<ReturnType<typeof createSupplyFormStore> | null>(
		null
	);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current = createSupplyFormStore(initialToken);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialToken);
		}
	}, [initialToken]);


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
