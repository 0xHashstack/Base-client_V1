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
import { useBorrowAddCollateralFormStore } from '../../../store/borrow-add-collateral-form.store';
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
	const userLoan = useBorrowAddCollateralFormStore(
		(state) => state.loanPosition
	);

	return (
		<WalletTokenProvider
			tokenAddress={
				userLoan?.collateralAsset.addr as Web3Address | undefined
			}
			decimals={userLoan?.collateralAsset.decimals}>
			<BorrowAddCollateralFormContent />
		</WalletTokenProvider>
	);
}

/**
 * The actual content of the add collateral form that uses the store
 */
function BorrowAddCollateralFormContent() {
	// Get handlers from the hook
	const { handleAddCollateral, userLoan, amount, closeDrawer, isLoading } =
		useBorrowAddCollateralForm();

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
				<ConnectedBtn.Primary
					onClick={handleAddCollateral}
					disabled={!amount || isLoading}
					showConnectButton
					parentWidth>
					{isLoading ? 'Processing...' : `Add  Collateral`}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowAddCollateralForm;
