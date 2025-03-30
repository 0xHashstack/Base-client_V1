'use client';
import { useCallback, useMemo } from 'react';
import { useBorrowFormStore } from '../store/borrow-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';
import { useWalletToken } from '@/context/wallet-token-provider';

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

	// Get values needed for validation from the store
	const { formatted: walletBalance, formatted: formattedWalletBalance } =
		useWalletToken();
	const maxBorrowAmount = useBorrowFormStore(
		(state) => state.maxBorrowAmount
	);

	// Get drawer context functions
	const { closeDrawer } = useBorrowDrawer();

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
	 * Handle borrow submission
	 */
	const handleBorrow = useCallback(async () => {
		if (!collateralMarket || !borrowMarket || !borrowAmount) return;

		// Validate form before proceeding
		const { isValid, collateralError, borrowError } = validateForm();
		if (!isValid) {
			console.error('Validation errors:', {
				collateralError,
				borrowError,
			});
			return;
		}

		try {
			setIsLoading(true);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Close the drawer after successful borrowing
			closeDrawer();

			// Reset the form
			reset();
		} catch (error) {
			console.error('Error borrowing:', error);
		} finally {
			setIsLoading(false);
		}
	}, [
		collateralMarket,
		borrowAmount,
		borrowMarket,
		closeDrawer,
		setIsLoading,
		reset,
		validateForm,
	]);

	/**
	 * Check if the borrow button should be disabled
	 */
	const isButtonDisabled = useMemo(() => {
		if (!amount || !borrowAmount || !borrowMarket || isLoading) {
			return true;
		}

		const { isValid } = validateForm();
		return !isValid;
	}, [amount, borrowAmount, borrowMarket, isLoading, validateForm]);

	return {
		// State
		amount,
		isLoading,
		collateralMarket,
		borrowAmount,
		borrowMarket,
		handleBorrow,
		walletBalance,
		formattedWalletBalance,
		maxBorrowAmount,

		// Actions
		setAmount,
		setCollateralMarket,
		setBorrowAmount,
		setBorrowMarket,
		reset,
		closeDrawer,

		// Validation
		validateForm,
		isButtonDisabled,
	};
}
