/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useCallback, useMemo } from 'react';
import {
	useBorrowSwapToDebtFormStore,
	TransactionStatus,
} from '../store/borrow-swap-to-debt-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';
import { BorrowTokenModel } from '@/lib/model/borrow-token.model';
import { Web3Address } from '@/types/web3';
import { useDappUser } from '@/context/user-data.context';
import { useWriteContract } from 'wagmi';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';
import '@prototype/bigint.prototype';

/**
 * Hook to handle the borrow swap to debt form functionality
 * @returns Borrow swap to debt form state and handlers
 */
export function useBorrowSwapToDebtForm() {
	// Use selectors to get only what we need from the store (following preferred pattern from memory)
	const amount = useBorrowSwapToDebtFormStore((state) => state.amount);
	const isLoading = useBorrowSwapToDebtFormStore((state) => state.isLoading);
	const marketLoan = useBorrowSwapToDebtFormStore(
		(state) => state.marketLoan
	);
	const transactionStatus = useBorrowSwapToDebtFormStore(
		(state) => state.transactionStatus
	);
	const validationError = useBorrowSwapToDebtFormStore(
		(state) => state.validationError
	);

	// Actions
	const setMarketLoan = useBorrowSwapToDebtFormStore(
		(state) => state.setMarketLoan
	);
	const setIsLoading = useBorrowSwapToDebtFormStore(
		(state) => state.setIsLoading
	);
	const setTransactionStatus = useBorrowSwapToDebtFormStore(
		(state) => state.setTransactionStatus
	);
	const setValidationError = useBorrowSwapToDebtFormStore(
		(state) => state.setValidationError
	);
	const setSelectedToken = useBorrowSwapToDebtFormStore(
		(state) => state.setSelectedToken
	);
	const reset = useBorrowSwapToDebtFormStore((state) => state.reset);
	const resetStore = useBorrowSwapToDebtFormStore(
		(state) => state.resetStore
	);

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

	// Get query client and query keys for invalidation
	const queryClient = useQueryClient();
	const borrowMarketDataQueryKey = useQueryKeyStore(
		(state) => state.borrowMarketDataQueryKey
	);
	const borrowMarketOverviewQueryKey = useQueryKeyStore(
		(state) => state.borrowMarketOverviewQueryKey
	);
	const walletBalanceQueryKey = useQueryKeyStore(
		(state) => state.walletBalanceQueryKey
	);

	// Get the current wallet address
	const { address: walletAddress } = useDappUser();

	// Create a borrow token model instance when the market changes
	const borrowTokenModel = useMemo(() => {
		if (!marketLoan) return null;
		return new BorrowTokenModel(
			marketLoan.borrowedAsset.address_ as Web3Address,
			marketLoan.borrowedAsset.decimals
		);
	}, [marketLoan]);

	/**
	 * Handle token approval for swap to debt
	 */
	const { writeContractAsync } = useWriteContract();
	const { setTransaction } = useCurrentTransactionStore();

	/**
	 * Handle swap to debt submission
	 */
	const handleSwapToDebt = useCallback(async () => {
		if (!marketLoan || !walletAddress || !borrowTokenModel) return;

		// Reset the form if transaction failed
		if (transactionStatus === TransactionStatus.TRANSACTION_FAILED) {
			resetStore(marketLoan);
			return;
		}

		try {
			setTransactionStatus(TransactionStatus.TRANSACTION_PROCESSING);
			setIsLoading(true);

			// Get appropriate swap to debt parameters
			const swapToDebtParams = borrowTokenModel.getSwapToDebtParams({
				loanId: marketLoan.loanId,
				amount: amount,
				tokenAddress: marketLoan.borrowedAsset.address_,
				decimals: marketLoan.borrowedAsset.decimals,
			});

			// Call the swap to debt function on the diamond contract
			const txHash = await writeContractAsync({
				...swapToDebtParams,
				address: swapToDebtParams.address as Web3Address,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Successfully swapped ${amount} ${marketLoan.borrowedAsset.symbol} to debt`,
					onSuccess: () => {
						// Invalidate the borrow market data query
						queryClient.invalidateQueries({
							queryKey: borrowMarketDataQueryKey,
						});
						// Invalidate the borrow market overview query
						queryClient.invalidateQueries({
							queryKey: borrowMarketOverviewQueryKey,
						});
						queryClient.invalidateQueries({
							queryKey: walletBalanceQueryKey,
						});
						// Set status to success
						setTransactionStatus(
							TransactionStatus.TRANSACTION_SUCCESS
						);
						// Close the drawer after successful swap
						closeDrawer();
						// Reset the form
						reset();
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						setIsLoading(false);
						toast.error(
							`Failed to swap ${marketLoan.borrowedAsset.symbol} to debt`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Swapping ${amount} ${marketLoan.borrowedAsset.symbol} to debt...`
				);
			}
		} catch (error) {
			console.error('Error swapping tokens to debt:', error);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
			setValidationError(
				'Failed to swap tokens to debt. Please try again.'
			);
		} finally {
			setIsLoading(false);
		}
	}, [
		marketLoan,
		amount,
		walletAddress,
		transactionStatus,
		borrowTokenModel,
		closeDrawer,
		setIsLoading,
		setTransactionStatus,
		setValidationError,
		reset,
		resetStore,
		writeContractAsync,
		setTransaction,
		queryClient,
		borrowMarketDataQueryKey,
		borrowMarketOverviewQueryKey,
	]);

	/**
	 * Get the button text based on the current transaction status
	 */
	const getButtonText = useCallback(() => {
		if (!marketLoan) return '';

		switch (transactionStatus) {
			case TransactionStatus.TRANSACTION_PROCESSING:
				return 'Processing...';
			case TransactionStatus.TRANSACTION_FAILED:
				return 'Failed - Try Again';
			case TransactionStatus.TRANSACTION_SUCCESS:
				return 'Success!';
			default:
				return `Swap to Debt`;
		}
	}, [marketLoan, transactionStatus]);

	return {
		// State
		amount,
		isLoading,
		marketLoan,
		transactionStatus,
		validationError,

		// Actions
		setMarketLoan,
		setTransactionStatus,
		setValidationError,
		setSelectedToken,
		handleSwapToDebt,
		getButtonText,

		reset,
		closeDrawer,
	};
}
