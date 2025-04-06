'use client';
import React, { useMemo } from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowSpendFormContextProvider } from '../../../context/borrow-spend-form.context';
import { useBorrowSpendForm } from '../../../hooks/useBorrowSpendForm';
import BorrowSpendFormInputs from './components/borrow-spend-form-inputs';
import BorrowSpendTabs from './components/borrow-spend-tabs';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import ValidationError from '@/components/ui/validation-error';

interface BorrowSpendFormProps {
	marketLoan?: LoanPosition;
}

/**
 * Form component for borrow spending options
 */
function BorrowSpendForm({ marketLoan: initialMarket }: BorrowSpendFormProps) {
	return (
		<BorrowSpendFormContextProvider marketLoan={initialMarket}>
			<BorrowSpendFormContent />
		</BorrowSpendFormContextProvider>
	);
}

/**
 * The actual content of the borrow spend form that uses the store
 */
function BorrowSpendFormContent() {
	// Get handlers from the hook
	const {
		isButtonDisabled,
		buttonText,
		handleLiquidityProvision,
		closeDrawer,
		getValidationError,
	} = useBorrowSpendForm();

	// Validate form and get error messages if any
	const validationError = useMemo(() => {
		return getValidationError();
	}, [getValidationError]);

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Spend</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
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
				{validationError && <ValidationError error={validationError} />}
				<ConnectedBtn.Primary
					onClick={handleLiquidityProvision}
					disabled={isButtonDisabled}
					showConnectButton
					parentWidth>
					{buttonText}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowSpendForm;
