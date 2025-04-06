'use client';
import { useCallback, useMemo } from 'react';
import {
	useBorrowSpendFormStore,
	BorrowSpendFormState,
	TransactionStatus,
} from '../store/borrow-spend-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { useBorrowDrawer } from '../context/borrow-drawer.context';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import { BorrowTokenModel } from '@/lib/model/borrow-token.model';
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
 * Hook to handle the borrow spend form functionality
 * @returns Borrow spend form state and handlers
 */
export function useBorrowSpendForm() {
	// Use selectors to get only what we need from the store
	const market = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.market
	);

	const activeTab = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.activeTab
	);
	const selectedDapp = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.selectedDapp
	);
	const selectedPool = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.selectedPool
	);
	const transactionStatus = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.transactionStatus
	);
	const setMarket = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.setMarket
	);

	const setActiveTab = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.setActiveTab
	);
	const setTransactionStatus = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.setTransactionStatus
	);
	const setValidationError = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.setValidationError
	);
	const reset = useBorrowSpendFormStore(
		(state: BorrowSpendFormState) => state.reset
	);

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

	// Get user address
	const { address: walletAddress } = useDappUser();

	// Get available borrow tokens from the token store
	const userAllLoans = useTokenStore((state) => state.userAllLoans);

	// Setup for API calls
	const { writeContractAsync } = useWriteContract();
	const { setTransaction } = useCurrentTransactionStore();
	const queryClient = useQueryClient();
	const { borrowMarketDataQueryKey, borrowMarketOverviewQueryKey } =
		useQueryKeyStore();

	/**
	 * Create token model instance when the market changes
	 */
	const borrowTokenModel = useMemo(() => {
		if (!market) return null;
		return new BorrowTokenModel(
			market.borrowedAsset.address_ as Web3Address,
			market.borrowedAsset.decimals
		);
	}, [market]);

	/**
	 * Handle market change
	 */
	const handleMarketChange = useCallback(
		(market: LoanPosition) => {
			setMarket(market);
		},
		[setMarket]
	);

	/**
	 * Handle tab change
	 */
	const handleTabChange = useCallback(
		(tab: 'liquidity' | 'swap') => {
			setActiveTab(tab);
		},
		[setActiveTab]
	);

	/**
	 * Validate if all required fields are selected
	 */
	const validateForm = useCallback((): ValidationResult => {
		if (!market) {
			setValidationError('Please select a borrow market');
			return {
				valid: false,
				error: 'Please select a borrow market',
			};
		}

		if (!selectedDapp) {
			setValidationError('Please select a DApp');
			return {
				valid: false,
				error: 'Please select a DApp',
			};
		}

		if (!selectedPool) {
			setValidationError('Please select a pool');
			return {
				valid: false,
				error: 'Please select a pool',
			};
		}

		if (!walletAddress) {
			setValidationError('Wallet not connected');
			return {
				valid: false,
				error: 'Wallet not connected',
			};
		}

		setValidationError('');
		return {
			valid: true,
			error: '',
		};
	}, [market, selectedDapp, selectedPool, walletAddress, setValidationError]);

	/**
	 * Handle liquidity provision submission
	 */
	const handleLiquidityProvision = useCallback(async () => {
		// Reset transaction status if it failed previously
		if (transactionStatus === TransactionStatus.TRANSACTION_FAILED) {
			setTransactionStatus(TransactionStatus.IDLE);
		}

		// Validate form before proceeding
		const { valid, error } = validateForm();
		if (!valid) {
			toast.error(error);
			return;
		}

		// Ensure all required values are available
		if (
			!market ||
			!selectedDapp ||
			!selectedPool ||
			!borrowTokenModel ||
			!walletAddress
		) {
			return;
		}

		try {
			setTransactionStatus(TransactionStatus.TRANSACTION_PROCESSING);

			// Get the dapp ID from the selected dapp
			const dappId =
				parseInt(selectedDapp.symbol.replace('dapp', ''), 10) || 1;

			// Prepare parameters for interacting with APY
			const interactParams = borrowTokenModel.getInteractWithApyParams({
				loanId: market.loanId,
				dappId,
				action: 1, // Action code for liquidity provision
				isCrossChain: false,
				amountIn: market.debtTokenAmount.formatBalance(
					market.borrowedAsset.decimals
				),
				minAmountOut: '0', // Minimum amount to receive (can be adjusted based on slippage)
				tokenIn: market.borrowedAsset.address_ as Web3Address,
				tokenOut: market.borrowedAsset.address_ as Web3Address, // Same token for liquidity provision
				data: '0x', // Additional data if needed
				tokenInDecimals: market.borrowedAsset.decimals,
			});

			// Call the contract to interact with APY
			const txHash = await writeContractAsync({
				...interactParams,
				address: interactParams.address as Web3Address,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Successfully provided liquidity with ${market.borrowedAsset.symbol}`,
					onSuccess: () => {
						// Update transaction status
						setTransactionStatus(
							TransactionStatus.TRANSACTION_SUCCESS
						);

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
						// Close the drawer after successful transaction
						closeDrawer();
						// Reset the form
						reset();
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						toast.error(
							`Failed to provide liquidity with ${market.borrowedAsset.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Providing liquidity with ${market.borrowedAsset.symbol} to ${selectedDapp.name}...`
				);
			}
		} catch (error) {
			console.error('Error providing liquidity:', error);
			toast.error('Failed to provide liquidity. Please try again.');
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		}
	}, [
		market,
		selectedDapp,
		selectedPool,
		borrowTokenModel,
		walletAddress,
		transactionStatus,
		validateForm,
		setTransactionStatus,
		reset,
		closeDrawer,
		writeContractAsync,
		setTransaction,
		queryClient,
		borrowMarketDataQueryKey,
		borrowMarketOverviewQueryKey,
	]);

	// Determine button state based on transaction status and validation
	const isButtonDisabled = useMemo(() => {
		// Always disable if not on liquidity tab
		if (activeTab !== 'liquidity') return true;

		// Check validation
		const { valid } = validateForm();
		return (
			!valid ||
			transactionStatus === TransactionStatus.TRANSACTION_PROCESSING
		);
	}, [activeTab, validateForm, transactionStatus]);

	// Determine button text based on transaction status
	const buttonText = useMemo(() => {
		return 'Spend';
	}, []);

	const getValidationError = useCallback(() => {
		return validateForm().error;
	}, [validateForm]);

	return {
		// State
		market,

		activeTab,
		userAllLoans,
		selectedDapp,
		selectedPool,
		transactionStatus,

		// Actions
		setMarket,
		setActiveTab,
		handleMarketChange,
		handleTabChange,
		handleLiquidityProvision,
		reset,
		closeDrawer,
		validateForm,
		isButtonDisabled,
		buttonText,
		getValidationError,
	};
}
