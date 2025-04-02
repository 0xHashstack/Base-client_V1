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
				token?.collateralAsset.addr as Web3Address | undefined
			}
			decimals={token?.collateralAsset.decimals}>
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
		formattedWalletBalance,
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

						{/* Wallet balance */}
						<div className='flex justify-between text-sm text-muted-foreground'>
							<span>Wallet Balance</span>
							<span>{formattedWalletBalance}</span>
						</div>

						{/* Validation error */}
						{getValidationError() && (
							<div className='text-sm text-destructive'>
								{getValidationError()}
							</div>
						)}
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				{getValidationError() && (
					<div className='mb-2 py-2 px-3 bg-badge-error border text-badge-error rounded-md'>
						<p className='text-sm'>{getValidationError()}</p>
					</div>
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
