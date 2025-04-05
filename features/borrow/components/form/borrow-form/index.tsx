'use client';
import React, { useMemo } from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowFormContextProvider } from '../../../context/borrow-form.context';
import { useBorrowForm } from '../../../hooks/useBorrowForm';
import BorrowFormInputs from './components/borrow-form-inputs';
import BorrowPriceBreakdownCard from './components/borrow-price-breakdown-card';
import { Card } from '@/components/ui/card';
import { MarketLoan } from '@/types/web3/borrow-market.types';
import { useBorrowFormStore } from '../../../store/borrow-form.store';
import { WalletTokenProvider } from '@/context/wallet-token-provider';
import ValidationError from '@/components/ui/validation-error';

interface BorrowFormProps {
	borrowMarket: MarketLoan;
}

/**
 * Form component for borrowing with collateral
 */
function BorrowForm({ borrowMarket }: BorrowFormProps) {
	return (
		<BorrowFormContextProvider initialBorrowMarket={borrowMarket}>
			<BorrowFormWithTokenProvider />
		</BorrowFormContextProvider>
	);
}

function BorrowFormWithTokenProvider() {
	const collateralMarket = useBorrowFormStore(
		(state) => state.collateralMarket
	);

	return (
		<WalletTokenProvider
			tokenAddress={collateralMarket?.address}
			decimals={collateralMarket?.decimals}>
			<BorrowFormContent />
		</WalletTokenProvider>
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
		validateForm,
		isButtonDisabled,
		formattedWalletBalance,
		maxBorrowAmount,
		getButtonText,
	} = useBorrowForm();

	// Validate form and get error messages if any
	const { collateralValid, borrowValid, collateralError, borrowError } =
		useMemo(() => {
			return validateForm();
		}, [validateForm]);

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
				{amount && !collateralValid && (
					<ValidationError
						error={collateralError}
						availableText={collateralError === 'Insufficient balance' ? 'Available' : undefined}
						availableValue={collateralError === 'Insufficient balance' ? formattedWalletBalance : undefined}
					/>
				)}
				{borrowAmount && !borrowValid && (
					<ValidationError
						error={borrowError}
						availableText={borrowError === 'Exceeds maximum borrowable amount' ? 'Max borrowable' : undefined}
						availableValue={borrowError === 'Exceeds maximum borrowable amount' ? maxBorrowAmount.toFixed(4) : undefined}
						availableSymbol={borrowError === 'Exceeds maximum borrowable amount' ? borrowMarket?.asset.symbol : undefined}
					/>
				)}
				<ConnectedBtn.Primary
					onClick={handleBorrow}
					disabled={isButtonDisabled}
					showConnectButton
					parentWidth>
					{getButtonText()}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowForm;
