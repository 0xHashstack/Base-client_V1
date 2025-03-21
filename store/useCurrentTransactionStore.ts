import { Web3Address } from '@/types/web3';
import { create } from 'zustand';

export interface Transaction {
	hash: Web3Address;
	status: 'pending' | 'success' | 'error';
	successToastMessage?: string;
	errorToastMessage?: string;
	onSuccess?: () => void;
	onError?: () => void;
}

interface CurrentTransactionState {
	transaction: Transaction | null;
	setTransaction: (transaction: Omit<Transaction, 'status'>) => void;
	updateTransactionStatus: (
		status: Transaction['status'],
		errorMessage?: string
	) => void;
	clearTransaction: () => void;
}

export const useCurrentTransactionStore = create<CurrentTransactionState>(
	(set) => ({
		transaction: null,

		setTransaction: (transaction) => {
			set({
				transaction: {
					...transaction,
					status: 'pending',
				},
			});
		},

		updateTransactionStatus: (status, errorMessage) => {
			set((state) => {
				// Only update if a transaction exists
				if (!state.transaction) return state;

				return {
					transaction: {
						...state.transaction,
						status,
						...(errorMessage ?
							{ errorToastMessage: errorMessage }
						:	{}),
					},
				};
			});
		},

		clearTransaction: () => {
			set({ transaction: null });
		},
	})
);
