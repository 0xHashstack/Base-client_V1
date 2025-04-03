import { useTokenStore } from '@/store/useTokenStore';
import {
	BorrowMarketCollateral,
	LoanPosition,
} from '@/types/web3/borrow-market.types';
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
interface BorrowAddCollateralFormState {
	amount: string;
	isLoading: boolean;
	loanPosition: LoanPosition | null;
	transactionStatus: TransactionStatus;
	collateralAsset: BorrowMarketCollateral | null;

	// Actions
	setAmount: (amount: string) => void;
	setMaxAmount: () => void;
	setLoanPosition: (
		loanPosition: BorrowAddCollateralFormState['loanPosition']
	) => void;
	setIsLoading: (isLoading: boolean) => void;
	setTransactionStatus: (status: TransactionStatus) => void;
	setCollateralAsset: (
		collateralAsset: BorrowAddCollateralFormState['collateralAsset']
	) => void;
	reset: () => void;
	resetStore: (
		newLoanPosition?: BorrowAddCollateralFormState['loanPosition']
	) => void;
}

const initialState = {
	amount: '',
	isLoading: false,
	loanPosition: null,
	transactionStatus: TransactionStatus.IDLE,
	collateralAsset: null,
};

// Create a Zustand store
const createBorrowAddCollateralFormStore = (
	initialLoanPosition: BorrowAddCollateralFormState['loanPosition'] = null
) =>
	create<BorrowAddCollateralFormState>((set) => ({
		...initialState,
		loanPosition: initialLoanPosition,
		collateralAsset:
			useTokenStore
				.getState()
				.borrowMarketCollateral.find(
					(collateral) =>
						collateral.address ===
						initialLoanPosition?.collateralAsset.addr
				) || null,
		setAmount: (amount) => set({ amount }),
		setMaxAmount: () => {
			set({ amount: '1000' }); // This would be replaced with actual balance logic
		},
		setLoanPosition: (loanPosition) => set({ loanPosition }),
		setIsLoading: (isLoading) => set({ isLoading }),
		setTransactionStatus: (status) => set({ transactionStatus: status }),
		reset: () =>
			set({
				...initialState,
				loanPosition: initialLoanPosition,
				collateralAsset: useTokenStore
					.getState()
					.borrowMarketCollateral.find(
						(collateral) =>
							collateral.address ===
							initialLoanPosition?.collateralAsset.addr
					),
			}),
		resetStore: (newLoanPosition) => {
			const loanPosition =
				newLoanPosition !== undefined ? newLoanPosition : (
					initialLoanPosition
				);
			set({
				...initialState,
				loanPosition,
				collateralAsset: useTokenStore
					.getState()
					.borrowMarketCollateral.find(
						(collateral) =>
							collateral.address ===
							loanPosition?.collateralAsset.addr
					),
			});
		},
		setCollateralAsset: (collateralAsset) => set({ collateralAsset }),
	}));

// Create a React context for the store
const BorrowAddCollateralFormStoreContext = createContext<ReturnType<
	typeof createBorrowAddCollateralFormStore
> | null>(null);

// Provider component
interface BorrowAddCollateralFormProviderProps {
	children: React.ReactNode;
	initialLoanPosition: BorrowAddCollateralFormState['loanPosition'];
}

export const BorrowAddCollateralFormProvider = ({
	children,
	initialLoanPosition,
}: BorrowAddCollateralFormProviderProps) => {
	const storeRef = useRef<ReturnType<
		typeof createBorrowAddCollateralFormStore
	> | null>(null);

	// Create the store if it doesn't exist
	if (!storeRef.current) {
		storeRef.current =
			createBorrowAddCollateralFormStore(initialLoanPosition);
	}

	// Update the token when it changes
	useEffect(() => {
		if (storeRef.current) {
			// Reset the form with the new token
			storeRef.current.getState().resetStore(initialLoanPosition);
		}
	}, [initialLoanPosition]);

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
