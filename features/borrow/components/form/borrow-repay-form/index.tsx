'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowRepayFormContextProvider } from '../../../context/borrow-repay-form.context';
import { useBorrowRepayForm } from '../../../hooks/useBorrowRepayForm';
import BorrowRepayFormInputs from './components/borrow-repay-form-inputs';
import BorrowRepayPriceBreakdownCard from './components/borrow-repay-price-breakdown-card';
import { Card } from '@/components/ui/card';
import { HstkToken } from '@/types/web3/token.types';
import BorrowRepayDetailsCard from './components/borrow-repay-details-card';

interface BorrowRepayFormProps {
	token: HstkToken;
}

/**
 * Form component for repaying borrowed tokens
 */
function BorrowRepayForm({ token }: BorrowRepayFormProps) {
	return (
		<BorrowRepayFormContextProvider token={token}>
			<BorrowRepayFormContent />
		</BorrowRepayFormContextProvider>
	);
}

/**
 * The actual content of the borrow repay form that uses the store
 */
function BorrowRepayFormContent() {
	// Get handlers from the hook
	const { handleRepay, token, amount, closeDrawer, isLoading } =
		useBorrowRepayForm();

	// If token is not set, don't render anything
	if (!token) return null;

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

					<Card className='flex flex-col gap-3 p-6 bg-card-secondary'>
						<BorrowRepayPriceBreakdownCard />
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				<ConnectedBtn.Primary
					onClick={handleRepay}
					disabled={!amount || !token || isLoading}
					showConnectButton
					parentWidth>
					{isLoading ?
						'Processing...'
					:	`Repay ${amount} ${token?.symbol || ''}`}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowRepayForm;
