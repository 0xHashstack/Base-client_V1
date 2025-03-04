import { HstkToken } from '@/types/web3';
import { createContext, useContext, useRef } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface SupplyWithdrawFormState {
	amount: string;
	isLoading: boolean;
	token: HstkToken | null;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setToken: (token: SupplyWithdrawFormState['token']) => void;
	setIsLoading: (isLoading: boolean) => void;
	reset: () => void;
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

	if (!storeRef.current) {
		storeRef.current = createSupplyWithdrawFormStore(initialToken);
	}

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
			'useWithdrawFormStore must be used within a WithdrawFormProvider'
		);
	}
	return useStore(store, selector);
};
