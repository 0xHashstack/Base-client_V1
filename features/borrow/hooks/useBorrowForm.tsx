'use client';
import { useCallback, useMemo } from 'react';
import {
	useBorrowFormStore,
	TransactionStatus,
} from '../store/borrow-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';
import { useWalletToken } from '@/context/wallet-token-provider';
import { BorrowTokenModel } from '@/lib/model/borrow-token.model';
import { SupplyTokenModel } from '@/lib/model/supply-token.model';
import { Web3Address } from '@/types/web3';
import { useDappUser } from '@/context/user-data.context';
import { useWriteContract } from 'wagmi';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';

/**
 * Type for validation result
 */
interface ValidationResult {
	valid: boolean;
	error: string;
}

/**
 * Hook to handle the borrow form functionality
 * @returns Borrow form state and handlers
 */
export function useBorrowForm() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowFormStore((state) => state.amount);
	const isLoading = useBorrowFormStore((state) => state.isLoading);
	const collateralMarket = useBorrowFormStore(
		(state) => state.collateralMarket
	);
	const borrowAmount = useBorrowFormStore((state) => state.borrowAmount);
	const borrowMarket = useBorrowFormStore((state) => state.borrowMarket);
	const setAmount = useBorrowFormStore((state) => state.setAmount);
	const setCollateralMarket = useBorrowFormStore(
		(state) => state.setCollateralMarket
	);
	const setBorrowAmount = useBorrowFormStore(
		(state) => state.setBorrowAmount
	);
	const setBorrowMarket = useBorrowFormStore(
		(state) => state.setBorrowMarket
	);
	const setIsLoading = useBorrowFormStore((state) => state.setIsLoading);
	const reset = useBorrowFormStore((state) => state.reset);
	const resetStore = useBorrowFormStore((state) => state.resetStore);

	// Get transaction status from the store
	const transactionStatus = useBorrowFormStore(
		(state) => state.transactionStatus
	);
	const setTransactionStatus = useBorrowFormStore(
		(state) => state.setTransactionStatus
	);

	// Get values needed for validation from the store
	const { formatted: walletBalance, formatted: formattedWalletBalance } =
		useWalletToken();
	const maxBorrowAmount = useBorrowFormStore(
		(state) => state.maxBorrowAmount
	);

	// Get the current wallet address
	const { address: walletAddress } = useDappUser();

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

	// Setup for API calls
	const { writeContractAsync } = useWriteContract();
	const { setTransaction } = useCurrentTransactionStore();
	const queryClient = useQueryClient();
	const { borrowMarketDataQueryKey, borrowMarketOverviewQueryKey } =
		useQueryKeyStore();

	/**
	 * Validate if the collateral amount is valid
	 */
	const validateCollateralAmount = useCallback((): ValidationResult => {
		if (!amount || amount === '0') {
			return {
				valid: false,
				error: 'Please enter an amount',
			};
		}

		const amountNum = parseFloat(amount);
		const walletBalanceNum = parseFloat(formattedWalletBalance || '0');

		if (isNaN(amountNum)) {
			return {
				valid: false,
				error: 'Invalid amount',
			};
		}

		if (amountNum <= 0) {
			return {
				valid: false,
				error: 'Amount must be greater than 0',
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
	}, [amount, formattedWalletBalance]);

	/**
	 * Validate if the borrow amount is valid
	 */
	const validateBorrowAmount = useCallback((): ValidationResult => {
		if (!borrowAmount || borrowAmount === '0') {
			return {
				valid: false,
				error: 'Please enter a borrow amount',
			};
		}

		const borrowAmountNum = parseFloat(borrowAmount);

		if (isNaN(borrowAmountNum)) {
			return {
				valid: false,
				error: 'Invalid borrow amount',
			};
		}

		if (borrowAmountNum <= 0) {
			return {
				valid: false,
				error: 'Borrow amount must be greater than 0',
			};
		}

		if (borrowAmountNum > maxBorrowAmount) {
			return {
				valid: false,
				error: 'Exceeds maximum borrowable amount',
			};
		}

		return {
			valid: true,
			error: '',
		};
	}, [borrowAmount, maxBorrowAmount]);

	/**
	 * Validate both collateral and borrow amounts
	 */
	const validateForm = useCallback(() => {
		const collateralValidation = validateCollateralAmount();
		const borrowValidation = validateBorrowAmount();

		return {
			isValid: collateralValidation.valid && borrowValidation.valid,
			collateralError: collateralValidation.error,
			borrowError: borrowValidation.error,
			collateralValid: collateralValidation.valid,
			borrowValid: borrowValidation.valid,
		};
	}, [validateCollateralAmount, validateBorrowAmount]);

	/**
	 * Create token model instances when the markets change
	 */
	const collateralTokenModel = useMemo(() => {
		if (!collateralMarket) return null;
		// Use SupplyTokenModel for the collateral token (for approvals)
		return new SupplyTokenModel(
			collateralMarket.address as Web3Address,
			collateralMarket.decimals
		);
	}, [collateralMarket]);

	const borrowTokenModel = useMemo(() => {
		if (!borrowMarket) return null;
		return new BorrowTokenModel(
			borrowMarket.asset.address_ as Web3Address,
			borrowMarket.asset.decimals
		);
	}, [borrowMarket]);

	/**
	 * Handle token approval for collateral
	 */
	const handleApprove = useCallback(async () => {
		if (
			!collateralMarket ||
			!collateralTokenModel ||
			!walletAddress ||
			!borrowMarket
		)
			return;

		try {
			setTransactionStatus(TransactionStatus.APPROVING);

			// Get the parameters for the approve transaction
			const approveParams = collateralTokenModel.getApproveParams({
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
					successToastMessage: `Approved ${collateralMarket.name} for collateral`,
					onSuccess: () => {
						setTransactionStatus(TransactionStatus.APPROVED);
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						toast.error(
							`Failed to approve ${collateralMarket.name}`
						);
					},
				});

				// Show initial info toast
				toast.info(`Approving ${collateralMarket.name} tokens...`);
			}
		} catch (error) {
			console.error('Error approving tokens:', error);
			toast.error(
				`Failed to approve ${collateralMarket.name}. Please try again.`
			);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		}
	}, [
		collateralMarket,
		collateralTokenModel,
		amount,
		walletAddress,
		borrowMarket,
		setTransactionStatus,
		writeContractAsync,
		setTransaction,
	]);

	/**
	 * Handle borrow submission
	 */
	const handleBorrow = useCallback(async () => {
		if (
			!collateralMarket ||
			!borrowMarket ||
			!borrowAmount ||
			!walletAddress ||
			!borrowTokenModel
		)
			return;

		// Validate form before proceeding
		const { isValid } = validateForm();
		if (!isValid) {
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
			resetStore(borrowMarket);
			return;
		}

		try {
			setTransactionStatus(TransactionStatus.TRANSACTION_PROCESSING);
			setIsLoading(true);

			// Get loan request parameters using the token model
			const loanRequestParams =
				borrowTokenModel.getLoanRequestFromBorrowCollateral({
					collateral: collateralMarket,
					collateralAmount: amount,
					borrowAmount,
					recipient: walletAddress as Web3Address,
				});

			// Call the loan request function on the contract
			const txHash = await writeContractAsync({
				...loanRequestParams,
				address: loanRequestParams.address as Web3Address,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Successfully borrowed ${borrowAmount} ${borrowMarket.asset.symbol}`,
					onSuccess: () => {
						// Invalidate the borrow market data query if available
						if (borrowMarketDataQueryKey) {
							queryClient.invalidateQueries({
								queryKey: borrowMarketDataQueryKey,
							});
						}
						// Invalidate the borrow market overview query if available
						if (borrowMarketOverviewQueryKey) {
							queryClient.invalidateQueries({
								queryKey: borrowMarketOverviewQueryKey,
							});
						}
						// Set status to success
						setTransactionStatus(
							TransactionStatus.TRANSACTION_SUCCESS
						);
						// Close the drawer after successful borrow
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
							`Failed to borrow ${borrowMarket.asset.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Borrowing ${borrowAmount} ${borrowMarket.asset.symbol}...`
				);
			}
		} catch (error) {
			console.error('Error borrowing tokens:', error);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		} finally {
			setIsLoading(false);
		}
	}, [
		collateralMarket,
		borrowAmount,
		borrowMarket,
		walletAddress,
		transactionStatus,
		validateForm,
		handleApprove,
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
		amount,
		borrowTokenModel, // Add borrowTokenModel to dependencies
	]);

	/**
	 * Get the button text based on the current transaction status
	 */
	const getButtonText = useCallback(() => {
		if (!borrowMarket) return 'Borrow';
		if (!collateralMarket) return `Borrow ${borrowMarket?.asset.symbol}`;
		switch (transactionStatus) {
			case TransactionStatus.APPROVING:
				return `Approving ${collateralMarket.name}...`;
			case TransactionStatus.APPROVED:
				return `Approved! Borrow ${borrowMarket.asset.symbol}`;
			case TransactionStatus.TRANSACTION_PROCESSING:
				return 'Processing...';
			case TransactionStatus.TRANSACTION_FAILED:
				return 'Failed - Try Again';
			case TransactionStatus.TRANSACTION_SUCCESS:
				return 'Success!';
			default:
				return `Borrow ${borrowMarket.asset.symbol}`;
		}
	}, [collateralMarket, borrowMarket, transactionStatus]);

	/**
	 * Check if the borrow button should be disabled
	 */
	const isButtonDisabled = useMemo(() => {
		if (!amount || !borrowAmount || !borrowMarket || isLoading) {
			return true;
		}

		const { isValid } = validateForm();
		return (
			!isValid ||
			transactionStatus === TransactionStatus.APPROVING ||
			transactionStatus === TransactionStatus.TRANSACTION_PROCESSING
		);
	}, [
		amount,
		borrowAmount,
		borrowMarket,
		isLoading,
		validateForm,
		transactionStatus,
	]);

	/**
	 * Get validation error message for collateral amount if any
	 */
	const getCollateralValidationError = useCallback(() => {
		return validateCollateralAmount().error;
	}, [validateCollateralAmount]);

	/**
	 * Get validation error message for borrow amount if any
	 */
	const getBorrowValidationError = useCallback(() => {
		return validateBorrowAmount().error;
	}, [validateBorrowAmount]);

	return {
		// State
		amount,
		isLoading,
		collateralMarket,
		borrowAmount,
		borrowMarket,
		transactionStatus,
		handleBorrow,
		walletBalance,
		formattedWalletBalance,
		maxBorrowAmount,
		getButtonText,

		// Actions
		setAmount,
		setCollateralMarket,
		setBorrowAmount,
		setBorrowMarket,
		setTransactionStatus,
		reset,
		closeDrawer,

		// Validation
		validateForm,
		isButtonDisabled,
		getCollateralValidationError,
		getBorrowValidationError,
	};
}
