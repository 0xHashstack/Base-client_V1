'use client';
import { useCallback, useMemo } from 'react';
import {
	useSupplyFormStore,
	TransactionStatus,
} from '../store/supply-form.store';
import { useEarnDrawer } from '../context/earn-drawer.context';
import { SupplyTokenModel } from '@/lib/model/supply-token.model';
import { Web3Address } from '@/types/web3';
import { useWalletTokenBalance } from '@/hooks/useWalletTokenBalance';
import { useWalletToken } from '@/context/wallet-token-provider';
import { useDappUser } from '@/context/user-data.context';
import { useWriteContract } from 'wagmi';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';

/**
 * Hook to handle the supply form functionality
 * @returns Supply form state and handlers
 */
export function useSupplyForm() {
	// Use selectors to get only what we need from the store
	const amount = useSupplyFormStore((state) => state.amount);
	const isLoading = useSupplyFormStore((state) => state.isLoading);
	const market = useSupplyFormStore((state) => state.market);
	const transactionStatus = useSupplyFormStore(
		(state) => state.transactionStatus
	);
	const setAmount = useSupplyFormStore((state) => state.setAmount);
	const setMarket = useSupplyFormStore((state) => state.setMarket);
	const setIsLoading = useSupplyFormStore((state) => state.setIsLoading);
	const setTransactionStatus = useSupplyFormStore(
		(state) => state.setTransactionStatus
	);
	const reset = useSupplyFormStore((state) => state.reset);
	// We'll use walletAddress from useDappUser instead of address
	const { closeDrawer } = useEarnDrawer();
	const { supplyMarketDataQueryKey, supplyMarketOverviewQueryKey } =
		useQueryKeyStore();

	// Get the current wallet address
	const { address: walletAddress } = useDappUser();

	// Fetch wallet balance for the current token
	const { formatted: formattedWalletBalance } = useWalletTokenBalance(
		market?.asset.address_ as Web3Address,
		{
			decimals: market?.asset.decimals,
		}
	);

	const { formatted: walletBalance } = useWalletToken();
	const queryClient = useQueryClient();

	// Create a token model instance when the market changes
	const tokenModel = useMemo(() => {
		if (!market) return null;
		return new SupplyTokenModel(
			market.asset.address_ as Web3Address,
			market.asset.decimals
		);
	}, [market]);

	/**
	 * Handle token approval for supply
	 */
	const { writeContractAsync } = useWriteContract();
	const { setTransaction } = useCurrentTransactionStore();

	const handleApprove = useCallback(async () => {
		if (!market || !tokenModel || !walletAddress) return;
		console.log('Approving tokens...', amount);

		try {
			setTransactionStatus(TransactionStatus.APPROVING);

			// Get the parameters for the approve transaction
			const approveParams = tokenModel.getApproveParams({
				spender: market.address_, // Use the market address as the spender
				amount,
			});

			// Call the approve function on the token contract
			const txHash = await writeContractAsync({
				...approveParams,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Approved ${market.asset.name} for supply`,
					onSuccess: () => {
						setTransactionStatus(TransactionStatus.APPROVED);
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						toast.error(`Failed to approve ${market.asset.name}`);
					},
				});

				// Show initial info toast
				toast.info(`Approving ${market.asset.name} tokens...`);
			}
		} catch (error) {
			console.error('Error approving tokens:', error);
			toast.error(
				`Failed to approve ${market.asset.name}. Please try again.`
			);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		}
	}, [
		market,
		tokenModel,
		amount,
		walletAddress,
		setTransactionStatus,
		writeContractAsync,
		setTransaction,
	]);

	/**
	 * Validate if the amount is valid for supply
	 */
	const validateAmount = useCallback(() => {
		if (!amount || amount === '0') {
			return {
				valid: false,
				error: 'Please enter an amount',
			};
		}

		const amountNum = parseFloat(amount);
		const walletBalanceNum = parseFloat(walletBalance);

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
	}, [amount, walletBalance]);

	/**
	 * Handle supply submission
	 */
	const handleSupply = useCallback(async () => {
		if (!market || !tokenModel || !walletAddress) return;

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

		try {
			setTransactionStatus(TransactionStatus.TRANSACTION_PROCESSING);
			setIsLoading(true);

			// Get deposit parameters using the token model
			const depositParams = tokenModel.getDepositParams({
				diamondAddress: market.address_ as Web3Address,
				amount,
				receiver: walletAddress as Web3Address,
			});

			// Call the deposit function on the diamond contract
			const txHash = await writeContractAsync({
				...depositParams,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Successfully supplied ${amount} ${market.asset.symbol}`,
					onSuccess: () => {
						// Invalidate the supply market data query
						queryClient.invalidateQueries({
							queryKey: supplyMarketDataQueryKey,
						});
						// Invalidate the supply market overview query
						queryClient.invalidateQueries({
							queryKey: supplyMarketOverviewQueryKey,
						});
						// Set status to success
						setTransactionStatus(
							TransactionStatus.TRANSACTION_SUCCESS
						);
						// Close the drawer after successful supply
						closeDrawer();
						// Reset the form
						reset();
					},
					onError: () => {
						setTransactionStatus(
							TransactionStatus.TRANSACTION_FAILED
						);
						setIsLoading(false);
						toast.error(`Failed to supply ${market.asset.symbol}`);
					},
				});

				// Show initial info toast
				toast.info(`Supplying ${amount} ${market.asset.symbol}...`);
			}
		} catch (error) {
			console.error('Error supplying tokens:', error);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		} finally {
			setIsLoading(false);
		}
	}, [
		market,
		tokenModel,
		amount,
		walletAddress,
		transactionStatus,
		validateAmount,
		handleApprove,
		closeDrawer,
		setIsLoading,
		setTransactionStatus,
		reset,
		writeContractAsync,
		setTransaction,
	]);

	/**
	 * Get the button text based on the current transaction status
	 */
	const getButtonText = useCallback(() => {
		if (!market) return '';

		switch (transactionStatus) {
			case TransactionStatus.APPROVING:
				return `Approving ${market.asset.symbol}...`;
			case TransactionStatus.APPROVED:
				return `Approved! Supply ${market.asset.symbol}`;
			case TransactionStatus.TRANSACTION_PROCESSING:
				return 'Processing...';
			case TransactionStatus.TRANSACTION_FAILED:
				return 'Failed - Try Again';
			case TransactionStatus.TRANSACTION_SUCCESS:
				return 'Success!';
			default:
				return `Supply ${market.asset.symbol}`;
		}
	}, [market, transactionStatus]);

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
		market,
		transactionStatus,
		walletBalance,
		formattedWalletBalance,
		handleSupply,
		getButtonText,
		isButtonDisabled,
		validateAmount,
		getValidationError,

		// Actions
		setAmount,
		setMarket,
		setTransactionStatus,
		reset,
		closeDrawer,
	};
}
