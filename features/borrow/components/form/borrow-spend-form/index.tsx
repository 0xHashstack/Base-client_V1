'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowSpendFormContextProvider } from '../../../context/borrow-spend-form.context';
import { useBorrowSpendForm } from '../../../hooks/useBorrowSpendForm';
import { HstkToken } from '@/types/web3/token.types';
import BorrowSpendFormInputs from './components/borrow-spend-form-inputs';
import BorrowSpendTabs from './components/borrow-spend-tabs';

interface BorrowSpendFormProps {
	initialMarket?: HstkToken;
}

/**
 * Form component for borrow spending options
 */
function BorrowSpendForm({ initialMarket }: BorrowSpendFormProps) {
	return (
		<BorrowSpendFormContextProvider initialMarket={initialMarket}>
			<BorrowSpendFormContent />
		</BorrowSpendFormContextProvider>
	);
}

/**
 * The actual content of the borrow spend form that uses the store
 */
function BorrowSpendFormContent() {
	// Get handlers from the hook
	const { market, activeTab, isLoading, handleLiquidityProvision } =
		useBorrowSpendForm();

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Spend</Text.Semibold20>
				<Btn.Outline
					onClick={() => {}}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<BorrowSpendFormInputs />
					<BorrowSpendTabs />
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				<ConnectedBtn.Primary
					onClick={handleLiquidityProvision}
					disabled={!market || isLoading || activeTab !== 'liquidity'}
					showConnectButton
					parentWidth>
					{isLoading ? 'Processing...' : `Spend`}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowSpendForm;
