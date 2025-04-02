'use client';
import { useCallback, useMemo } from 'react';
import {
	useBorrowAddCollateralFormStore,
	TransactionStatus,
} from '../store/borrow-add-collateral-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';
import { useWalletToken } from '@/context/wallet-token-provider';
import { SupplyTokenModel } from '@/lib/model/supply-token.model';
import { BorrowTokenModel } from '@/lib/model/borrow-token.model';
import { Web3Address } from '@/types/web3';
import { useDappUser } from '@/context/user-data.context';
import { useWriteContract } from 'wagmi';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';
import { useTokenStore } from '@/store/useTokenStore';

/**
 * Type for validation result
 */
interface ValidationResult {
	valid: boolean;
	error: string;
}

/**
 * Hook to handle the borrow add collateral form functionality
 * @returns Borrow add collateral form state and handlers
 */
export function useBorrowAddCollateralForm() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowAddCollateralFormStore((state) => state.amount);
	const isLoading = useBorrowAddCollateralFormStore(
		(state) => state.isLoading
	);
	const userLoan = useBorrowAddCollateralFormStore(
		(state) => state.loanPosition
	);
	const setAmount = useBorrowAddCollateralFormStore(
		(state) => state.setAmount
	);
	const setIsLoading = useBorrowAddCollateralFormStore(
		(state) => state.setIsLoading
	);
	const reset = useBorrowAddCollateralFormStore((state) => state.reset);

	// Get transaction status from the store
	const transactionStatus = useBorrowAddCollateralFormStore(
		(state) => state.transactionStatus
	);
	const setTransactionStatus = useBorrowAddCollateralFormStore(
		(state) => state.setTransactionStatus
	);

	// Get values needed for validation from the store
	const { formatted: formattedWalletBalance } = useWalletToken();

	// Get the current wallet address
	const { address: walletAddress } = useDappUser();

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

	// Get borrow market collateral from token store
	const borrowMarketCollaterals = useTokenStore(
		(state) => state.borrowMarketCollateral
	);

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
	 * Find the collateral asset in borrowMarketCollaterals
	 */
	const collateralAsset = useMemo(() => {
		if (!userLoan || !borrowMarketCollaterals.length) return null;

		return borrowMarketCollaterals.find(
			(collateral) => collateral.address === userLoan.collateralAsset.addr
		);
	}, [userLoan, borrowMarketCollaterals]);

	/**
	 * Create token model instances for the collateral asset
	 */
	const collateralTokenModel = useMemo(() => {
		if (!userLoan) return null;
		// Use SupplyTokenModel for the collateral token (for approvals)
		return new SupplyTokenModel(
			userLoan.collateralAsset.addr as Web3Address,
			userLoan.collateralAsset.decimals
		);
	}, [userLoan]);

	const borrowTokenModel = useMemo(() => {
		if (!userLoan) return null;
		return new BorrowTokenModel(
			userLoan.borrowedAsset.address_ as Web3Address,
			userLoan.borrowedAsset.decimals
		);
	}, [userLoan]);

	/**
	 * Handle token approval for collateral
	 */
	const handleApprove = useCallback(async () => {
		if (
			!userLoan ||
			!collateralTokenModel ||
			!walletAddress ||
			!collateralAsset
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
					successToastMessage: `Approved ${userLoan.collateralAsset.symbol} for collateral`,
					onSuccess: () => {
						setTransactionStatus(TransactionStatus.APPROVED);
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						toast.error(
							`Failed to approve ${userLoan.collateralAsset.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Approving ${userLoan.collateralAsset.symbol} tokens...`
				);
			}
		} catch (error) {
			console.error('Error approving tokens:', error);
			toast.error(
				`Failed to approve ${userLoan.collateralAsset.symbol}. Please try again.`
			);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		}
	}, [
		userLoan,
		collateralTokenModel,
		amount,
		walletAddress,
		collateralAsset,
		setTransactionStatus,
		writeContractAsync,
		setTransaction,
	]);

	/**
	 * Handle add collateral submission
	 */
	const handleAddCollateral = useCallback(async () => {
		if (!userLoan || !borrowTokenModel || !collateralAsset) return;

		// Validate form before proceeding
		const validation = validateCollateralAmount();
		if (!validation.valid) {
			toast.error(validation.error);
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
			reset();
			return;
		}

		try {
			setTransactionStatus(TransactionStatus.TRANSACTION_PROCESSING);
			setIsLoading(true);

			// Get add collateral parameters using the token model
			const addCollateralParams =
				borrowTokenModel.getAddCollateralFromBorrowCollateral({
					loanId: userLoan.loanId,
					collateral: collateralAsset,
					collateralAmount: amount,
				});

			// Call the add collateral function on the contract
			const txHash = await writeContractAsync({
				...addCollateralParams,
				address: addCollateralParams.address as Web3Address,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Successfully added ${amount} ${userLoan.collateralAsset.symbol} as collateral`,
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
						// Close the drawer after successful addition of collateral
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
							`Failed to add ${userLoan.collateralAsset.symbol} collateral`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Adding ${amount} ${userLoan.collateralAsset.symbol} as collateral...`
				);
			}
		} catch (error) {
			console.error('Error adding collateral:', error);
			toast.error(
				`Failed to add ${userLoan.collateralAsset.symbol} collateral. Please try again.`
			);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
			setIsLoading(false);
		}
	}, [
		amount,
		userLoan,
		borrowTokenModel,
		collateralAsset,
		closeDrawer,
		setIsLoading,
		reset,
		validateCollateralAmount,
		transactionStatus,
		handleApprove,
		setTransactionStatus,
		writeContractAsync,
		setTransaction,
		borrowMarketDataQueryKey,
		borrowMarketOverviewQueryKey,
		queryClient,
	]);

	/**
	 * Get the button text based on transaction status
	 */
	const getButtonText = useCallback(() => {
		if (isLoading) return 'Processing...';

		switch (transactionStatus) {
			case TransactionStatus.IDLE:
				return 'Approve';
			case TransactionStatus.APPROVING:
				return 'Approving...';
			case TransactionStatus.APPROVED:
				return 'Add Collateral';
			case TransactionStatus.TRANSACTION_PROCESSING:
				return 'Adding Collateral...';
			case TransactionStatus.TRANSACTION_FAILED:
				return 'Try Again';
			default:
				return 'Add Collateral';
		}
	}, [transactionStatus, isLoading]);

	/**
	 * Get validation error message if any
	 */
	const getValidationError = useCallback(() => {
		if (!amount) return '';

		const validation = validateCollateralAmount();
		return validation.valid ? '' : validation.error;
	}, [amount, validateCollateralAmount]);

	/**
	 * Check if button should be disabled
	 */
	const isButtonDisabled = useMemo(() => {
		if (!amount || isLoading) return true;
		if (transactionStatus === TransactionStatus.APPROVING) return true;
		if (transactionStatus === TransactionStatus.TRANSACTION_PROCESSING)
			return true;

		// Check if amount is valid
		const validation = validateCollateralAmount();
		return !validation.valid;
	}, [amount, isLoading, transactionStatus, validateCollateralAmount]);

	return {
		// State
		amount,
		isLoading,
		userLoan,
		transactionStatus,
		collateralAsset,
		handleAddCollateral,
		getButtonText,
		isButtonDisabled,
		validateCollateralAmount,
		getValidationError,

		// Actions
		setAmount,
		reset,
		closeDrawer,
	};
}
