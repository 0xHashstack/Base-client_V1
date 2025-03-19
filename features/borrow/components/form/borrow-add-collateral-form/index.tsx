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
import { CollateralToken } from '@/types/web3';

interface BorrowAddCollateralFormProps {
	token: CollateralToken;
}

/**
 * Form component for adding collateral to a borrow position
 */
function BorrowAddCollateralForm({ token }: BorrowAddCollateralFormProps) {
	return (
		<BorrowAddCollateralFormContextProvider token={token}>
			<BorrowAddCollateralFormContent />
		</BorrowAddCollateralFormContextProvider>
	);
}

/**
 * The actual content of the add collateral form that uses the store
 */
function BorrowAddCollateralFormContent() {
	// Get handlers from the hook
	const { handleAddCollateral, token, amount, closeDrawer, isLoading } =
		useBorrowAddCollateralForm();

	// If token is not set, don't render anything
	if (!token) return null;

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
					{isLoading ?
						'Processing...'
					:	`Add ${token.symbol} Collateral`}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowAddCollateralForm;
