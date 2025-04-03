'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowAddCollateralFormContextProvider } from '../../../context/borrow-add-collateral-form.context';
import { useBorrowAddCollateralForm } from '../../../hooks/useBorrowAddCollateralForm';
import AddCollateralFormInputs from './components/add-collateral-form-inputs';
import AddCollateralPriceBreakdownCard from './components/add-collateral-price-breakdown-card';
import { Card } from '@/components/ui/card';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import {
	useBorrowAddCollateralFormStore,
	TransactionStatus,
} from '../../../store/borrow-add-collateral-form.store';
import { WalletTokenProvider } from '@/context/wallet-token-provider';
import { Web3Address } from '@/types/web3';

interface BorrowAddCollateralFormProps {
	loanPosition: LoanPosition;
}

/**
 * Form component for adding collateral to a borrow position
 */
function BorrowAddCollateralForm({
	loanPosition,
}: BorrowAddCollateralFormProps) {
	return (
		<BorrowAddCollateralFormContextProvider loanPosition={loanPosition}>
			<BorrowAddCollateralFormWithTokenProvider />
		</BorrowAddCollateralFormContextProvider>
	);
}

/**
 * Wrapper component that provides wallet token context
 */
function BorrowAddCollateralFormWithTokenProvider() {
	const collateralAsset = useBorrowAddCollateralFormStore(
		(state) => state.collateralAsset
	);

	return (
		<WalletTokenProvider
			tokenAddress={collateralAsset?.address as Web3Address | undefined}
			decimals={collateralAsset?.decimals}>
			<BorrowAddCollateralFormContent />
		</WalletTokenProvider>
	);
}

/**
 * The actual content of the add collateral form that uses the store
 */
function BorrowAddCollateralFormContent() {
	// Get handlers and state from the hook
	const {
		handleAddCollateral,
		userLoan,
		closeDrawer,
		getButtonText,
		isButtonDisabled,
		getValidationError,
		transactionStatus,
	} = useBorrowAddCollateralForm();

	// If loanPosition is not set, don't render anything
	if (!userLoan) return null;

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Add Collateral</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<AddCollateralFormInputs />
					<Card className='flex flex-col gap-3 p-6 bg-card-bold'>
						<AddCollateralPriceBreakdownCard />
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
					onClick={handleAddCollateral}
					disabled={isButtonDisabled}
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

export default BorrowAddCollateralForm;
