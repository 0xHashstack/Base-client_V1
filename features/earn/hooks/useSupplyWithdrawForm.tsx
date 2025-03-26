'use client';
import { useCallback, useMemo } from 'react';
import {
	useSupplyWithdrawFormStore,
	TransactionStatus,
} from '../store/supply-withdraw-form.store';
import { useEarnDrawer } from '../context/earn-drawer.context';
import { SupplyTokenModel } from '@/lib/model/supply-token.model';
import { Web3Address } from '@/types/web3';
import { useDappUser } from '@/context/user-data.context';
import { useWriteContract } from 'wagmi';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryKeyStore } from '@/store/useQueryKeyStore';

/**
 * Hook to handle the withdraw form functionality
 * @returns Withdraw form state and handlers
 */
export function useSupplyWithdrawForm() {
	// Use selectors to get only what we need from the store
	const amount = useSupplyWithdrawFormStore((state) => state.amount);
	const isLoading = useSupplyWithdrawFormStore((state) => state.isLoading);
	const position = useSupplyWithdrawFormStore(
		(state) => state.supplyPosition
	);
	const transactionStatus = useSupplyWithdrawFormStore(
		(state) => state.transactionStatus
	);
	const setAmount = useSupplyWithdrawFormStore((state) => state.setAmount);
	const setPosition = useSupplyWithdrawFormStore(
		(state) => state.setSupplyPosition
	);
	const setIsLoading = useSupplyWithdrawFormStore(
		(state) => state.setIsLoading
	);
	const setTransactionStatus = useSupplyWithdrawFormStore(
		(state) => state.setTransactionStatus
	);
	const reset = useSupplyWithdrawFormStore((state) => state.reset);

	const { closeDrawer } = useEarnDrawer();
	const { supplyMarketDataQueryKey, supplyMarketOverviewQueryKey } =
		useQueryKeyStore();

	// Get the current wallet address
	const { address: walletAddress } = useDappUser();

	// For contract interactions
	const { writeContractAsync } = useWriteContract();
	const { setTransaction } = useCurrentTransactionStore();
	const queryClient = useQueryClient();

	/**
	 * Create a token model instance when the token changes
	 */
	const tokenModel = useMemo(() => {
		if (!position) return null;
		return new SupplyTokenModel(
			position.underlyingAsset.address_ as Web3Address,
			position.underlyingAsset.decimals
		);
	}, [position]);

	/**
	 * Create a token model instance when the token changes
	 */
	const supplyTokenModel = useMemo(() => {
		if (!position) return null;
		return new SupplyTokenModel(
			position.supplyAsset.address_ as Web3Address,
			position.supplyAsset.decimals
		);
	}, [position]);

	/**
	 * Validate if the amount is valid for withdrawal
	 */
	const validateAmount = useCallback(() => {
		if (!amount || amount === '0') {
			return {
				valid: false,
				error: 'Please enter an amount',
			};
		}

		if (!position) {
			return {
				valid: false,
				error: 'No position selected',
			};
		}

		const amountNum = parseFloat(amount);
		const availableBalanceNum = parseFloat(
			position.receiptTokens.formatBalance(
				position.underlyingAsset.decimals
			)
		);

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

		if (amountNum > availableBalanceNum) {
			return {
				valid: false,
				error: 'Insufficient available balance',
			};
		}

		return {
			valid: true,
			error: '',
		};
	}, [amount, position]);

	/**
	 * Handle withdraw submission
	 */
	const handleWithdraw = useCallback(async () => {
		if (!position || !tokenModel || !walletAddress) return;

		// Validate amount before proceeding
		const validation = validateAmount();
		if (!validation.valid) {
			console.error('Validation error:', validation.error);
			toast.error(validation.error);
			return;
		}

		try {
			setTransactionStatus(TransactionStatus.TRANSACTION_PROCESSING);
			setIsLoading(true);

			// Get withdraw parameters using the token model
			const withdrawParams = tokenModel.getWithdrawDepositParams({
				diamondAddress: position.supplyAsset.address_ as Web3Address,
				rTokenShares: amount,
				receiver: walletAddress as Web3Address,
				owner: walletAddress as Web3Address,
			});

			// Call the withdraw function on the diamond contract
			const txHash = await writeContractAsync({
				...withdrawParams,
			});

			if (txHash) {
				// Set transaction in the store for monitoring
				setTransaction({
					hash: txHash,
					successToastMessage: `Successfully withdrew ${amount} ${position.supplyAsset.symbol}`,
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
						// Close the drawer after successful withdrawal
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
							`Failed to withdraw ${position.supplyAsset.symbol}`
						);
					},
				});

				// Show initial info toast
				toast.info(
					`Withdrawing ${amount} ${position.supplyAsset.symbol}...`
				);
			}
		} catch (error) {
			console.error('Error withdrawing tokens:', error);
			toast.error(
				`Failed to withdraw ${position.supplyAsset.symbol}. Please try again.`
			);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		} finally {
			setIsLoading(false);
		}
	}, [
		position,
		tokenModel,
		amount,
		walletAddress,
		validateAmount,
		setTransactionStatus,
		setIsLoading,
		writeContractAsync,
		setTransaction,
		queryClient,
		supplyMarketDataQueryKey,
		supplyMarketOverviewQueryKey,
		closeDrawer,
		reset,
	]);

	/**
	 * Get the button text based on the current transaction status
	 */
	const getButtonText = useCallback(() => {
		if (!position) return '';

		switch (transactionStatus) {
			case TransactionStatus.TRANSACTION_PROCESSING:
				return 'Processing...';
			case TransactionStatus.TRANSACTION_FAILED:
				return 'Failed - Try Again';
			case TransactionStatus.TRANSACTION_SUCCESS:
				return 'Success!';
			default:
				return `Withdraw ${position.supplyAsset.symbol}`;
		}
	}, [position, transactionStatus]);

	/**
	 * Check if the button should be disabled
	 */
	const isButtonDisabled = useCallback(() => {
		return (
			!amount ||
			isLoading ||
			transactionStatus === TransactionStatus.TRANSACTION_PROCESSING
		);
	}, [amount, isLoading, transactionStatus]);

	return {
		// State
		amount,
		isLoading,
		position,
		transactionStatus,
		handleWithdraw,
		validateAmount,

		// Actions
		setAmount,
		setPosition,
		setTransactionStatus,
		reset,
		closeDrawer,
		isButtonDisabled,
		getButtonText,
	};
}
