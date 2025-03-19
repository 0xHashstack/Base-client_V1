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

interface SupplyWithdrawFormProps {
	token: {
		name: string;
		symbol: string;
		address: string;
		iconUrl: string;
		decimals: number;
	};
}

/**
 * Form component for withdrawing tokens from the protocol
 */
function SupplyWithdrawForm({ token }: SupplyWithdrawFormProps) {
	return (
		<SupplyWithdrawFormContextProvider token={token}>
			<SupplyWithdrawFormContent />
		</SupplyWithdrawFormContextProvider>
	);
}

/**
 * The actual content of the withdraw form that uses the store
 */
function SupplyWithdrawFormContent() {
	// Get handlers from the hook
	const { handleWithdraw, token, amount, closeDrawer, isLoading } =
		useSupplyWithdrawForm();

	// If token is not set, don't render anything
	if (!token) return null;

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
				<ConnectedBtn.Primary
					onClick={handleWithdraw}
					disabled={!amount || isLoading}
					showConnectButton
					parentWidth>
					{isLoading ? 'Processing...' : `Withdraw ${token.symbol}`}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default SupplyWithdrawForm;
