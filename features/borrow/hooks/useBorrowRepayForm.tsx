'use client';
import { useCallback } from 'react';
import { useBorrowRepayFormStore } from '../store/borrow-repay-form.store';
import { useBorrowDrawer } from '../context/borrow-drawer.context';

/**
 * Hook to handle the borrow repay form functionality
 * @returns Borrow repay form state and handlers
 */
export function useBorrowRepayForm() {
  // Use selectors to get only what we need from the store
  const amount = useBorrowRepayFormStore((state) => state.amount);
  const isLoading = useBorrowRepayFormStore((state) => state.isLoading);
  const token = useBorrowRepayFormStore((state) => state.token);
  const fee = useBorrowRepayFormStore((state) => state.fee);
  const setAmount = useBorrowRepayFormStore((state) => state.setAmount);
  const setToken = useBorrowRepayFormStore((state) => state.setToken);
  const setIsLoading = useBorrowRepayFormStore((state) => state.setIsLoading);
  const setFee = useBorrowRepayFormStore((state) => state.setFee);
  const reset = useBorrowRepayFormStore((state) => state.reset);

  // Get drawer context functions
  const { closeDrawer } = useBorrowDrawer();

  /**
   * Handle repay submission
   */
  const handleRepay = useCallback(async () => {
    if (!token || !amount) return;

    try {
      setIsLoading(true);
      // In a real implementation, this would call the contract to repay
      console.log(`Repaying ${amount} ${token.symbol}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close the drawer after successful repaying
      closeDrawer();

      // Reset the form
      reset();
    } catch (error) {
      console.error('Error repaying:', error);
    } finally {
      setIsLoading(false);
    }
  }, [amount, token, closeDrawer, setIsLoading, reset]);

  /**
   * Calculate fee whenever amount changes
   */
  const calculateFee = useCallback(() => {
    if (!amount || !token) return;
    
    // Simple fee calculation (0.5% of amount)
    const feeAmount = parseFloat(amount) * 0.005;
    setFee(feeAmount.toFixed(4));
  }, [amount, token, setFee]);

  return {
    // State
    amount,
    isLoading,
    token,
    fee,
    handleRepay,
    calculateFee,

    // Actions
    setAmount,
    setToken,
    reset,
    closeDrawer,
  };
}
