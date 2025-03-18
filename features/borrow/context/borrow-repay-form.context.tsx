'use client';
import React, { ReactNode } from 'react';
import { BorrowRepayFormProvider } from '../store/borrow-repay-form.store';
import { HstkToken } from '@/types/web3/token.types';

interface BorrowRepayFormContextProviderProps {
  children: ReactNode;
  token: HstkToken | null;
}

/**
 * Provider component that wraps the Zustand context provider
 */
export function BorrowRepayFormContextProvider({
  children,
  token,
}: BorrowRepayFormContextProviderProps) {
  return (
    <BorrowRepayFormProvider initialToken={token}>
      {children}
    </BorrowRepayFormProvider>
  );
}

// Re-export the useBorrowRepayFormStore for convenience
export { useBorrowRepayFormStore } from '../store/borrow-repay-form.store';
