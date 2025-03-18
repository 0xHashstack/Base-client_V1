import { HstkToken } from '@/types/web3/token.types';
import { createContext, useContext, useRef, useEffect } from 'react';
import { create, useStore } from 'zustand';

// Define the store state and actions
interface BorrowRepayFormState {
  amount: string;
  isLoading: boolean;
  token: HstkToken | null;
  fee: string;

  // Actions
  setAmount: (amount: string) => void;
  setMaxAmount: () => void;
  setToken: (token: BorrowRepayFormState['token']) => void;
  setIsLoading: (isLoading: boolean) => void;
  setFee: (fee: string) => void;
  reset: () => void;
  resetStore: (newToken?: BorrowRepayFormState['token']) => void;
}

const initialState = {
  amount: '',
  isLoading: false,
  token: null,
  fee: '0.00',
};

// Create a Zustand store
const createBorrowRepayFormStore = (
  initialToken: BorrowRepayFormState['token'] = null
) =>
  create<BorrowRepayFormState>((set) => ({
    ...initialState,
    token: initialToken,
    setAmount: (amount) => set({ amount }),
    setMaxAmount: () => {
      set({ amount: '1000' }); // This would be replaced with actual balance logic
    },
    setToken: (token) => set({ token }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setFee: (fee) => set({ fee }),
    reset: () => set({ ...initialState, token: initialToken }),
    resetStore: (newToken) =>
      set({
        ...initialState,
        token: newToken !== undefined ? newToken : initialToken,
      }),
  }));

// Create a React context for the store
const BorrowRepayFormStoreContext = createContext<ReturnType<
  typeof createBorrowRepayFormStore
> | null>(null);

// Provider component
interface BorrowRepayFormProviderProps {
  children: React.ReactNode;
  initialToken: BorrowRepayFormState['token'];
}

export const BorrowRepayFormProvider = ({
  children,
  initialToken,
}: BorrowRepayFormProviderProps) => {
  const storeRef = useRef<ReturnType<
    typeof createBorrowRepayFormStore
  > | null>(null);

  // Create the store if it doesn't exist
  if (!storeRef.current) {
    storeRef.current = createBorrowRepayFormStore(initialToken);
  }

  // Update the token when it changes
  useEffect(() => {
    if (storeRef.current) {
      // Reset the form with the new token
      storeRef.current.getState().resetStore(initialToken);
    }
  }, [initialToken]);

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
