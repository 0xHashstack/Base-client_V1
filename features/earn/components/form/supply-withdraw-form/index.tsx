'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { SupplyWithdrawFormContextProvider } from '../../../context/supply-withdraw-form.context';
import { useSupplyWithdrawForm } from '../../../hooks/useSupplyWithdrawForm';
import WithdrawFormInputs from './components/withdraw-form-inputs';
import WithdrawTokenInfoCard from './components/withdraw-token-info-card';
import WithdrawFormPriceBreakdownCard from './components/withdraw-form-price-breakdown-card';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SupplyPosition } from '@/types/web3/supply-market.types';

interface SupplyWithdrawFormProps {
	position: SupplyPosition;
}

/**
 * Form component for withdrawing tokens from the protocol
 */
function SupplyWithdrawForm({ position }: SupplyWithdrawFormProps) {
	return (
		<SupplyWithdrawFormContextProvider position={position}>
			<SupplyWithdrawFormContent />
		</SupplyWithdrawFormContextProvider>
	);
}

/**
 * The actual content of the withdraw form that uses the store
 */
function SupplyWithdrawFormContent() {
	// Get handlers from the hook
	const {
		handleWithdraw,
		position,
		amount,
		closeDrawer,
		validateAmount,
		getButtonText,
		isButtonDisabled,
	} = useSupplyWithdrawForm();

	// Validate amount and get error message if any
	const { valid: isAmountValid, error: validationError } =
		React.useMemo(() => {
			return validateAmount();
		}, [validateAmount]);

	// If position is not set, don't render anything
	if (!position) return null;

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Withdraw</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<WithdrawFormInputs />
					<Card className='flex flex-col gap-3 p-6 bg-card-bold'>
						<WithdrawTokenInfoCard />
						<Separator />
						<WithdrawFormPriceBreakdownCard />
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				{amount && !isAmountValid && (
					<div className='mb-2 py-2 px-3 bg-red-50 border border-red-200 rounded-md'>
						<p className='text-sm text-red-600'>
							{validationError}
							{validationError ===
								'Insufficient available balance' && (
								<span className='block text-xs mt-1'>
									Available:{' '}
									{position.receiptTokens.formatBalance(
										position.underlyingAsset.decimals
									)}{' '}
									{position.underlyingAsset.symbol}
								</span>
							)}
						</p>
					</div>
				)}
				<ConnectedBtn.Primary
					onClick={handleWithdraw}
					disabled={
						isButtonDisabled() || (amount !== '' && !isAmountValid)
					}
					showConnectButton
					parentWidth>
					{getButtonText()}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default SupplyWithdrawForm;
