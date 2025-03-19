'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowFormContextProvider } from '../../../context/borrow-form.context';
import { useBorrowForm } from '../../../hooks/useBorrowForm';
import BorrowFormInputs from './components/borrow-form-inputs';
import BorrowPriceBreakdownCard from './components/borrow-price-breakdown-card';
import { Card } from '@/components/ui/card';
import { CollateralToken, HstkToken } from '@/types/web3/token.types';

interface BorrowFormProps {
	token: CollateralToken;
	initialBorrowMarket?: HstkToken;
}

/**
 * Form component for borrowing with collateral
 */
function BorrowForm({ token, initialBorrowMarket }: BorrowFormProps) {
	return (
		<BorrowFormContextProvider
			token={token}
			initialBorrowMarket={initialBorrowMarket}>
			<BorrowFormContent />
		</BorrowFormContextProvider>
	);
}

/**
 * The actual content of the borrow form that uses the store
 */
function BorrowFormContent() {
	// Get handlers from the hook
	const {
		handleBorrow,
		token,
		amount,
		borrowAmount,
		borrowMarket,
		closeDrawer,
		isLoading,
	} = useBorrowForm();

	// If token is not set, don't render anything
	if (!token) return null;

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Borrow</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<BorrowFormInputs />
					<Card className='flex flex-col gap-3 p-6 bg-card-bold'>
						<BorrowPriceBreakdownCard />
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				<ConnectedBtn.Primary
					onClick={handleBorrow}
					disabled={
						!amount || !borrowAmount || !borrowMarket || isLoading
					}
					showConnectButton
					parentWidth>
					{isLoading ?
						'Processing...'
					:	`Borrow ${borrowAmount} ${borrowMarket?.symbol || ''} with ${token.symbol} Collateral`
					}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowForm;
