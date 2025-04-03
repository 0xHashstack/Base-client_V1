'use client';
import { useCallback, useMemo } from 'react';
import {
	useBorrowRepayFormStore,
	TransactionStatus,
} from '../store/borrow-repay-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';
import { BorrowTokenModel } from '@/lib/model/borrow-token.model';
import { Web3Address } from '@/types/web3';
import { useWalletToken } from '@/context/wallet-token-provider';
import { useDappUser } from '@/context/user-data.context';
import { useWriteContract } from 'wagmi';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';
import { SupplyTokenModel } from '@/lib/model/supply-token.model';
import '@prototype/bigint.prototype';

/**
 * Hook to handle the borrow repay form functionality
 * @returns Borrow repay form state and handlers
 */
export function useBorrowRepayForm() {
	// Use selectors to get only what we need from the store
	const isLoading = useBorrowRepayFormStore((state) => state.isLoading);
	const marketLoan = useBorrowRepayFormStore((state) => state.marketLoan);
	const fee = useBorrowRepayFormStore((state) => state.fee);
	const transactionStatus = useBorrowRepayFormStore(
		(state) => state.transactionStatus
	);
	const setMarketLoan = useBorrowRepayFormStore(
		(state) => state.setMarketLoan
	);
	const setIsLoading = useBorrowRepayFormStore((state) => state.setIsLoading);
	const setTransactionStatus = useBorrowRepayFormStore(
		(state) => state.setTransactionStatus
	);
	const reset = useBorrowRepayFormStore((state) => state.reset);
	const resetStore = useBorrowRepayFormStore((state) => state.resetStore);

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

	// Get query client and query keys for invalidation
	const queryClient = useQueryClient();
	const { borrowMarketDataQueryKey, borrowMarketOverviewQueryKey } =
		useQueryKeyStore();

	// Get the current wallet address
	const { address: walletAddress } = useDappUser();

	// Get wallet token balance
	const { formatted: walletBalance, formatted: formattedWalletBalance } =
		useWalletToken();

	// Create a token model instance when the market changes
	const tokenModel = useMemo(() => {
		if (!marketLoan) return null;
		return new SupplyTokenModel(
			marketLoan.collateralAsset.addr as Web3Address,
			marketLoan.collateralAsset.decimals
		);
	}, [marketLoan]);

	// Create a borrow token model instance when the market changes
	const borrowTokenModel = useMemo(() => {
		if (!marketLoan) return null;
		return new BorrowTokenModel(
			marketLoan.borrowedAsset.address_ as Web3Address,
			marketLoan.borrowedAsset.decimals
		);
	}, [marketLoan]);

	const amount = useMemo(() => {
		return marketLoan?.repayFees || BigInt(0);
	}, [marketLoan?.repayFees]);

	/**
	 * Validate if the amount is valid for repay
	 */
	const validateAmount = useCallback(() => {
		if (!marketLoan)
			return {
				valid: false,
				error: 'Market loan not found',
			};
		const amountNum = amount.format(marketLoan.collateralAsset.decimals);
		const walletBalanceNum = parseFloat(walletBalance);

		if (isNaN(amountNum)) {
			return {
				valid: false,
				error: 'Invalid amount',
			};
		}

		if (amountNum > walletBalanceNum) {
			return {
				valid: false,
				error: 'Insufficient balance',
			};
		}

		return {
			valid: true,
			error: '',
		};
	}, [amount, walletBalance, marketLoan]);

	/**
	 * Handle token approval for repay
	 */
	const { writeContractAsync } = useWriteContract();
	const { setTransaction } = useCurrentTransactionStore();

	const handleApprove = useCallback(async () => {
		if (!marketLoan || !tokenModel || !walletAddress) return;
		try {
			setTransactionStatus(TransactionStatus.APPROVING);

			// Get the parameters for the approve transaction
			const approveParams = tokenModel.getApproveParams({
				amount: amount.toString(),
			});

			// Call the approve function on the token contract
			const txHash = await writeContractAsync({
				...approveParams,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Approved ${marketLoan.collateralAsset.symbol} for repay`,
					onSuccess: () => {
						setTransactionStatus(TransactionStatus.APPROVED);
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						toast.error(
							`Failed to approve ${marketLoan.collateralAsset.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Approving ${marketLoan.collateralAsset.symbol} tokens...`
				);
			}
		} catch (error) {
			console.error('Error approving tokens:', error);
			toast.error(
				`Failed to approve ${marketLoan.collateralAsset.symbol}. Please try again.`
			);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		}
	}, [
		marketLoan,
		tokenModel,
		amount,
		walletAddress,
		setTransactionStatus,
		writeContractAsync,
		setTransaction,
	]);

	/**
	 * Handle repay submission
	 */
	const handleRepay = useCallback(async () => {
		if (!marketLoan || !tokenModel || !walletAddress || !borrowTokenModel)
			return;

		// Validate amount before proceeding
		const validation = validateAmount();
		if (!validation.valid) {
			console.error('Validation error:', validation.error);
			return;
		}

		// If not approved yet, start the approval process
		if (transactionStatus === TransactionStatus.IDLE) {
			return handleApprove();
		}

		// If already in approving state, don't do anything
		if (transactionStatus === TransactionStatus.APPROVING) {
			return;
		}

		// Reset the form if transaction failed
		if (transactionStatus === TransactionStatus.TRANSACTION_FAILED) {
			resetStore(marketLoan);
			return;
		}

		try {
			setTransactionStatus(TransactionStatus.TRANSACTION_PROCESSING);
			setIsLoading(true);

			// Get appropriate repay parameters based on repayment type

			const repayParams = borrowTokenModel.getRepayLoanParams({
				loanId: marketLoan.loanId,
				repayAmount: marketLoan.repayFees.toString(),
				decimals: marketLoan.collateralAsset.decimals,
			});

			// Call the repay function on the diamond contract
			const txHash = await writeContractAsync({
				...repayParams,
				address: repayParams.address as Web3Address,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Successfully repaid ${amount} ${marketLoan?.borrowedAsset?.symbol}`,
					onSuccess: () => {
						// Invalidate the borrow market data query
						queryClient.invalidateQueries({
							queryKey: borrowMarketDataQueryKey,
						});
						// Invalidate the borrow market overview query
						queryClient.invalidateQueries({
							queryKey: borrowMarketOverviewQueryKey,
						});
						// Set status to success
						setTransactionStatus(
							TransactionStatus.TRANSACTION_SUCCESS
						);
						// Close the drawer after successful repay
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
							`Failed to repay ${marketLoan?.borrowedAsset?.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Repaying ${amount} ${marketLoan?.borrowedAsset?.symbol}...`
				);
			}
		} catch (error) {
			console.error('Error repaying tokens:', error);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		} finally {
			setIsLoading(false);
		}
	}, [
		marketLoan,
		tokenModel,
		amount,
		walletAddress,
		transactionStatus,
		validateAmount,
		handleApprove,
		borrowTokenModel,
		closeDrawer,
		setIsLoading,
		setTransactionStatus,
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
			case TransactionStatus.APPROVING:
				return `Approving ${marketLoan.borrowedAsset.symbol}...`;
			case TransactionStatus.APPROVED:
				return `Approved! Repay ${marketLoan.borrowedAsset.symbol}`;
			case TransactionStatus.TRANSACTION_PROCESSING:
				return 'Processing...';
			case TransactionStatus.TRANSACTION_FAILED:
				return 'Failed - Try Again';
			case TransactionStatus.TRANSACTION_SUCCESS:
				return 'Success!';
			default:
				return `Repay Loan`;
		}
	}, [marketLoan, transactionStatus]);

	/**
	 * Check if the button should be disabled
	 */
	const isButtonDisabled = useCallback(() => {
		const isValidAmount = validateAmount().error === '';
		return (
			!isValidAmount ||
			isLoading ||
			transactionStatus === TransactionStatus.APPROVING ||
			transactionStatus === TransactionStatus.TRANSACTION_PROCESSING
		);
	}, [isLoading, transactionStatus, validateAmount]);

	/**
	 * Get validation error message if any
	 */
	const getValidationError = useCallback(() => {
		return validateAmount().error;
	}, [validateAmount]);

	return {
		// State
		amount,
		isLoading,
		marketLoan,
		fee,
		transactionStatus,
		walletBalance,
		formattedWalletBalance,
		handleRepay,
		getButtonText,
		isButtonDisabled,
		validateAmount,
		getValidationError,

		// Actions
		setMarketLoan,
		setTransactionStatus,
		reset,
		closeDrawer,
	};
}
