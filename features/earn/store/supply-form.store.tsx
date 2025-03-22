import { SupplyMarketData } from '@/types/web3/supply-market.types';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface SupplyFormState {
	amount: string;
	isLoading: boolean;
	market: SupplyMarketData | null;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setMarket: (market: SupplyFormState['market']) => void;
	setIsLoading: (isLoading: boolean) => void;
	reset: () => void;
	resetStore: (newMarket?: SupplyFormState['market']) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	token: null,
};

// Create a Zustand store
const createSupplyFormStore = (
	initialToken: SupplyFormState['market'] = null
) =>
	create<SupplyFormState>((set) => ({
		...initialState,
		market: initialToken,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' });
		},
		setMarket: (token) => set({ market: token }),
		setIsLoading: (isLoading) => set({ isLoading }),
		reset: () => set({ ...initialState, market: initialToken }),
		resetStore: (newToken) =>
			set({
				...initialState,
				market: newToken !== undefined ? newToken : initialToken,
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
