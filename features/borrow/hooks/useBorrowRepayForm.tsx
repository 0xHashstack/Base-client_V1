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
import { DECIMALS } from '@/constant/web3/decimal.constant';
/**
 * Hook to handle the borrow repay form functionality
 * @returns Borrow repay form state and handlers
 */
export function useBorrowRepayForm() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowRepayFormStore((state) => state.amount);
	const isLoading = useBorrowRepayFormStore((state) => state.isLoading);
	const marketLoan = useBorrowRepayFormStore((state) => state.marketLoan);
	const fee = useBorrowRepayFormStore((state) => state.fee);
	const transactionStatus = useBorrowRepayFormStore(
		(state) => state.transactionStatus
	);
	const setAmount = useBorrowRepayFormStore((state) => state.setAmount);
	const setMarketLoan = useBorrowRepayFormStore(
		(state) => state.setMarketLoan
	);
	const setIsLoading = useBorrowRepayFormStore((state) => state.setIsLoading);
	const setFee = useBorrowRepayFormStore((state) => state.setFee);
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
			marketLoan.asset.address_ as Web3Address,
			marketLoan.asset.decimals
		);
	}, [marketLoan]);

	// Create a borrow token model instance when the market changes
	const borrowTokenModel = useMemo(() => {
		if (!marketLoan) return null;
		return new BorrowTokenModel(
			marketLoan.asset.address_ as Web3Address,
			marketLoan.asset.decimals
		);
	}, [marketLoan]);

	/**
	 * Validate if the amount is valid for repay
	 */
	const validateAmount = useCallback(() => {
		const amountNum = parseFloat(amount || '0');
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
	}, [amount, walletBalance]);

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
				amount,
			});

			// Call the approve function on the token contract
			const txHash = await writeContractAsync({
				...approveParams,
				address: approveParams.address as Web3Address,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Approved ${marketLoan.asset.symbol} for repay`,
					onSuccess: () => {
						setTransactionStatus(TransactionStatus.APPROVED);
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						toast.error(
							`Failed to approve ${marketLoan.asset.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(`Approving ${marketLoan.asset.symbol} tokens...`);
			}
		} catch (error) {
			console.error('Error approving tokens:', error);
			toast.error(
				`Failed to approve ${marketLoan.asset.symbol}. Please try again.`
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
	 * Check if the amount is a full repayment
	 */
	const isFullRepayment = useCallback(() => {
		if (!marketLoan || !amount) return false;

		// Get the outstanding debt amount
		// Convert bigint to string then to float for comparison
		const outstandingDebt =
			parseFloat(marketLoan.userLoan.repayAmount.toString()) /
			10 ** marketLoan.asset.decimals;
		const repayAmount = parseFloat(amount);

		// Consider it a full repayment if the amount is equal to or greater than the debt
		// or if it's very close (within 0.1% to account for potential rounding issues)
		return (
			repayAmount >= outstandingDebt ||
			(outstandingDebt - repayAmount) / outstandingDebt < 0.001
		);
	}, [marketLoan, amount]);

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

			// Determine if this is a full repayment
			const fullRepayment = isFullRepayment();

			// Get appropriate repay parameters based on repayment type
			let repayParams;
			if (fullRepayment) {
				// Use zero repay loan for full repayments
				repayParams = borrowTokenModel.getRepayLoanParams({
					loanId: marketLoan.userLoan.loanId,
					repayAmount: marketLoan.userLoan.repayAmount
						.format(DECIMALS.BORROW_MARKET)
						.toString(),
				});
			} else {
				// Use regular repay loan for partial repayments
				repayParams = borrowTokenModel.getRepayLoanParams({
					loanId: marketLoan.userLoan.loanId,
					repayAmount: amount,
				});
			}

			// Call the repay function on the diamond contract
			const txHash = await writeContractAsync({
				...repayParams,
				address: repayParams.address as Web3Address,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage:
						fullRepayment ?
							`Successfully repaid full loan of ${marketLoan.asset.symbol}`
						:	`Successfully repaid ${amount} ${marketLoan.asset.symbol}`,
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
							`Failed to repay ${marketLoan.asset.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(
					fullRepayment ?
						`Repaying full loan of ${marketLoan.asset.symbol}...`
					:	`Repaying ${amount} ${marketLoan.asset.symbol}...`
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
		isFullRepayment,
	]);

	/**
	 * Calculate fee whenever amount changes
	 */
	const calculateFee = useCallback(() => {
		if (!amount || !marketLoan) return;

		// Simple fee calculation (0.5% of amount)
		const feeAmount = parseFloat(amount) * 0.005;
		setFee(feeAmount.toFixed(4));
	}, [amount, marketLoan, setFee]);

	/**
	 * Get the button text based on the current transaction status
	 */
	const getButtonText = useCallback(() => {
		if (!marketLoan) return '';

		switch (transactionStatus) {
			case TransactionStatus.APPROVING:
				return `Approving ${marketLoan.asset.symbol}...`;
			case TransactionStatus.APPROVED:
				return `Approved! Repay ${marketLoan.asset.symbol}`;
			case TransactionStatus.TRANSACTION_PROCESSING:
				return 'Processing...';
			case TransactionStatus.TRANSACTION_FAILED:
				return 'Failed - Try Again';
			case TransactionStatus.TRANSACTION_SUCCESS:
				return 'Success!';
			default:
				return `Repay ${marketLoan.asset.symbol}`;
		}
	}, [marketLoan, transactionStatus]);

	/**
	 * Check if the button should be disabled
	 */
	const isButtonDisabled = useCallback(() => {
		return (
			!amount ||
			isLoading ||
			transactionStatus === TransactionStatus.APPROVING ||
			transactionStatus === TransactionStatus.TRANSACTION_PROCESSING
		);
	}, [amount, isLoading, transactionStatus]);

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
		calculateFee,
		getButtonText,
		isButtonDisabled,
		validateAmount,
		getValidationError,

		// Actions
		setAmount,
		setMarketLoan,
		setTransactionStatus,
		reset,
		closeDrawer,
	};
}
