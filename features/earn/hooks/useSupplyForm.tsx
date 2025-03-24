'use client';
import { useCallback, useMemo } from 'react';
import { useSupplyFormStore, TransactionStatus } from '../store/supply-form.store';
import { useEarnDrawer } from '../context/earn-drawer.context';
import { SupplyTokenModel } from '@/lib/model/supply-token.model';
import { useAccount } from 'wagmi';
import { Web3Address } from '@/types/web3';

/**
 * Hook to handle the supply form functionality
 * @returns Supply form state and handlers
 */
export function useSupplyForm() {
	// Use selectors to get only what we need from the store
	const amount = useSupplyFormStore((state) => state.amount);
	const isLoading = useSupplyFormStore((state) => state.isLoading);
	const market = useSupplyFormStore((state) => state.market);
	const transactionStatus = useSupplyFormStore((state) => state.transactionStatus);
	const setAmount = useSupplyFormStore((state) => state.setAmount);
	const setMarket = useSupplyFormStore((state) => state.setMarket);
	const setIsLoading = useSupplyFormStore((state) => state.setIsLoading);
	const setTransactionStatus = useSupplyFormStore((state) => state.setTransactionStatus);
	const reset = useSupplyFormStore((state) => state.reset);

	const { closeDrawer } = useEarnDrawer();

	// Get the current wallet address
	const { address: walletAddress } = useAccount();

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
	const handleApprove = useCallback(async () => {
		if (!market || !tokenModel || !walletAddress) return;
		console.log('Approving tokens...', amount);

		try {
			setTransactionStatus(TransactionStatus.APPROVING);

			// In a real implementation, we would call the ERC20 approve function here
			// For now, we'll simulate the approval process
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Set status to approved
			setTransactionStatus(TransactionStatus.APPROVED);
		} catch (error) {
			console.error('Error approving tokens:', error);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		}
	}, [market, tokenModel, amount, walletAddress, setTransactionStatus]);

	/**
	 * Handle supply submission
	 */
	const handleSupply = useCallback(async () => {
		if (!market || !tokenModel || !walletAddress) return;
		console.log('Supplying tokens...', amount);

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

			console.log('Deposit params:', depositParams);
			// In a real implementation, we would use wagmi's useWriteContract here
			// For now, we'll simulate the deposit process
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Set status to success
			setTransactionStatus(TransactionStatus.TRANSACTION_SUCCESS);

			// Close the drawer after successful supply
			closeDrawer();

			// Reset the form
			reset();
		} catch (error) {
			console.error('Error supplying tokens:', error);
			setTransactionStatus(TransactionStatus.TRANSACTION_FAILED);
		} finally {
			setIsLoading(false);
		}
	}, [market, tokenModel, amount, walletAddress, transactionStatus, handleApprove, closeDrawer, setIsLoading, setTransactionStatus, reset]);

	/**
	 * Get the button text based on the current transaction status
	 */
	const getButtonText = useCallback(() => {
		if (!market) return '';

		switch (transactionStatus) {
			case TransactionStatus.APPROVING:
				return `Approving ${market.asset.symbol}...`;
			case TransactionStatus.APPROVED:
				return `Supply ${market.asset.symbol}`;
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

	return {
		// State
		amount,
		isLoading,
		market,
		transactionStatus,
		handleSupply,
		getButtonText,
		isButtonDisabled,

		// Actions
		setAmount,
		setMarket,
		setTransactionStatus,
		reset,
		closeDrawer,
	};
}
