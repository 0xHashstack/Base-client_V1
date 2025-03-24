'use client';

import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'sonner';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { web3DataProvider } from '@/constant/config';

export function TransactionStatusListener() {
	const { transaction, updateTransactionStatus, clearTransaction } =
		useCurrentTransactionStore();

	// Always call hooks at the top level, regardless of whether we have a transaction
	const { isSuccess, isError, error } = useWaitForTransactionReceipt(
		transaction?.status === 'pending' ?
			{
				hash: transaction.hash as `0x${string}`,
			}
		:	{ hash: undefined }
	);

	useEffect(() => {
		// Only proceed if we have a pending transaction
		if (!transaction || transaction.status !== 'pending') return;

		if (isSuccess) {
			// Transaction succeeded
			updateTransactionStatus('success');

			// Show success toast
			toast.success(
				transaction.successToastMessage ||
					'Transaction completed successfully.'
			);

			// Call onSuccess callback if provided
			if (transaction.onSuccess) {
				transaction.onSuccess();
			}

			// Clear the transaction after a delay
			setTimeout(() => clearTransaction(), 2000);
		} else if (isError && error) {
			// Transaction failed
			updateTransactionStatus(
				'error',
				error.message || 'Transaction failed'
			);

			// Add link to transaction explorer
			toast.error('Transaction failed', {
				description: transaction.errorToastMessage || error.name,
				action: {
					label: 'View in Base scan',
					onClick: () =>
						window.open(
							web3DataProvider.viewInExplorer(transaction.hash),
							'_blank'
						),
				},
			});

			// Call onError callback if provided
			if (transaction.onError) {
				transaction.onError();
			}

			// Clear the transaction after a delay
			setTimeout(() => clearTransaction(), 2000);
		}
	}, [
		isSuccess,
		isError,
		error,
		transaction,
		updateTransactionStatus,
		clearTransaction,
	]);

	return null;
}

export default TransactionStatusListener;
