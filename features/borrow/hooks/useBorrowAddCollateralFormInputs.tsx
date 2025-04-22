'use client';
import { useCallback, useMemo } from 'react';
import {
	TransactionStatus,
	useBorrowAddCollateralFormStore,
} from '../store/borrow-add-collateral-form.store';
import { useTokenStore } from '@/store/useTokenStore';
import { useWalletToken } from '@/context/wallet-token-provider';
import { BorrowMarketCollateral } from '@/types/web3/borrow-market.types';
import '@prototype/number.prototype';
/**
 * Hook to handle the borrow add collateral form inputs
 * @returns Form input state and handlers
 */
export function useBorrowAddCollateralFormInputs() {
	// Use selectors to get only what we need from the store
	const amount = useBorrowAddCollateralFormStore((state) => state.amount);
	const userLoan = useBorrowAddCollateralFormStore(
		(state) => state.loanPosition
	);
	const setAmount = useBorrowAddCollateralFormStore(
		(state) => state.setAmount
	);

	const transactionStatus = useBorrowAddCollateralFormStore(
		(state) => state.transactionStatus
	);

	const collateralAsset = useBorrowAddCollateralFormStore(
		(state) => state.collateralAsset
	);
	const setCollateralAsset = useBorrowAddCollateralFormStore(
		(state) => state.setCollateralAsset
	);

	const collateralOptions = useTokenStore(
		(state) => state.borrowMarketCollateral
	);

	const filteredCollateralOptions = useMemo(() => {
		const mainCollateralToken = collateralOptions.find(
			(collateral) =>
				collateral.address === userLoan?.collateralAsset.addr
		);
		if (!mainCollateralToken) return [];
		const underlyingToken = collateralOptions.find(
			(collateral) =>
				collateral.address === mainCollateralToken.underlyingAddress
		);
		if (!underlyingToken) return [mainCollateralToken];
		return [mainCollateralToken, underlyingToken];
	}, [collateralOptions, userLoan?.collateralAsset.addr]);

	const {
		data: walletBalance,
		isLoading: walletBalanceLoading,
		isError: walletBalanceError,
		refetch: refetchWalletBalance,
		formatted: formattedWalletBalance,
		formattedNumber: formattedWalletBalanceNumber,
	} = useWalletToken();

	// Maximum amount for the slider (from wallet balance)
	const MAX_AMOUNT = useMemo(() => {
		if (
			walletBalanceLoading ||
			walletBalanceError ||
			!formattedWalletBalanceNumber
		)
			return 0;
		return formattedWalletBalanceNumber;
	}, [
		formattedWalletBalanceNumber,
		walletBalanceLoading,
		walletBalanceError,
	]);

	// Check if form inputs should be disabled
	const isFormDisabled = useMemo(() => {
		return (
			walletBalanceError ||
			MAX_AMOUNT <= 0 ||
			transactionStatus !== TransactionStatus.IDLE
		);
	}, [walletBalanceError, MAX_AMOUNT, transactionStatus]);

	// Handle amount change
	const handleAmountChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newAmount = e.target.value;
			setAmount(newAmount);
		},
		[setAmount]
	);

	const sliderPercentage = useMemo(() => {
		if (MAX_AMOUNT <= 0) return 0;
		if (!amount || isNaN(parseFloat(amount))) return 0;

		const percentage = (parseFloat(amount) / MAX_AMOUNT) * 100;
		return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
	}, [amount, MAX_AMOUNT]);

	// Handle max click
	const handleMaxClick = useCallback(() => {
		if (MAX_AMOUNT <= 0) return;

		// Set amount to max available in wallet
		setAmount(MAX_AMOUNT.toFixedDecimals());
	}, [MAX_AMOUNT, setAmount]);

	// Handle slider change
	const handleSliderChange = useCallback(
		(values: number[]) => {
			if (MAX_AMOUNT <= 0) return;

			const percentage = values[0];

			// Calculate amount based on percentage of wallet balance
			const calculatedAmount = (percentage / 100) * MAX_AMOUNT;
			setAmount(
				percentage === 100 ?
					calculatedAmount.toFixedDecimals()
				:	calculatedAmount.toFixed(3)
			);
		},
		[MAX_AMOUNT, setAmount]
	);

	// Handle token change - this is now disabled since we're using the loan's collateral
	const handleTokenChange = (
		collateralAsset: BorrowMarketCollateral | null
	) => {
		setCollateralAsset(collateralAsset);
	};

	return {
		amount,
		sliderPercentage,
		userLoan,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
		walletBalanceLoading,
		walletBalanceError,
		refetchWalletBalance,
		walletBalance,
		isFormDisabled,
		formattedWalletBalance,
		collateralAsset,
		filteredCollateralOptions,
	};
}
