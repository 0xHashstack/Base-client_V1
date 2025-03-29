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
import { MarketLoan } from '@/types/web3/borrow-market.types';

interface BorrowFormProps {
	borrowMarket: MarketLoan;
}

/**
 * Form component for borrowing with collateral
 */
function BorrowForm({ borrowMarket }: BorrowFormProps) {
	return (
		<BorrowFormContextProvider initialBorrowMarket={borrowMarket}>
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
		amount,
		borrowAmount,
		borrowMarket,
		closeDrawer,
		isLoading,
	} = useBorrowForm();

	if (!borrowMarket) return null;

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
					{isLoading ? 'Processing...' : `Borrow`}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowForm;
