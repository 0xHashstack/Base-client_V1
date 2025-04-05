'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowRepayFormContextProvider } from '../../../context/borrow-repay-form.context';
import { useBorrowRepayForm } from '../../../hooks/useBorrowRepayForm';
import { TransactionStatus } from '../../../store/borrow-repay-form.store';
import BorrowRepayFormInputs from './components/borrow-repay-form-inputs';
import BorrowRepayPriceBreakdownCard from './components/borrow-repay-price-breakdown-card';
import { Card } from '@/components/ui/card';
import BorrowRepayDetailsCard from './components/borrow-repay-details-card';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import { useBorrowRepayFormStore } from '../../../store/borrow-repay-form.store';
import { WalletTokenProvider } from '@/context/wallet-token-provider';
import { Web3Address } from '@/types/web3';
import ValidationError from '@/components/ui/validation-error';

interface BorrowRepayFormProps {
	marketLoan: LoanPosition;
}

/**
 * Form component for repaying borrowed tokens
 */
function BorrowRepayForm({ marketLoan }: BorrowRepayFormProps) {
	return (
		<BorrowRepayFormContextProvider marketLoan={marketLoan}>
			<BorrowRepayFormWithTokenProvider />
		</BorrowRepayFormContextProvider>
	);
}

/**
 * Wrapper component that provides wallet token context
 */
function BorrowRepayFormWithTokenProvider() {
	const token = useBorrowRepayFormStore((state) => state.marketLoan);

	return (
		<WalletTokenProvider
			tokenAddress={
				token?.borrowedAsset.address_ as Web3Address | undefined
			}
			decimals={token?.borrowedAsset.decimals}>
			<BorrowRepayFormContent />
		</WalletTokenProvider>
	);
}

/**
 * The actual content of the borrow repay form that uses the store
 */
function BorrowRepayFormContent() {
	// Get handlers from the hook
	const {
		handleRepay,
		marketLoan,
		closeDrawer,
		transactionStatus,
		getButtonText,
		isButtonDisabled,
		getValidationError,
	} = useBorrowRepayForm();

	// If token is not set, don't render anything
	if (!marketLoan) return null;

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Repay</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<BorrowRepayFormInputs />
					<BorrowRepayDetailsCard />

					<Card className='flex flex-col gap-3 p-6 bg-card-bold'>
						<BorrowRepayPriceBreakdownCard />
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				{getValidationError() && (
					<ValidationError error={getValidationError()} />
				)}
				<ConnectedBtn.Primary
					onClick={handleRepay}
					disabled={isButtonDisabled()}
					showConnectButton
					parentWidth
					className={
						(
							transactionStatus ===
							TransactionStatus.TRANSACTION_FAILED
						) ?
							'bg-destructive'
						:	''
					}>
					{getButtonText()}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowRepayForm;
