'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { SupplyFormContextProvider } from '../../../context/supply-form.context';
import { useSupplyForm } from '../../../hooks/useSupplyForm';
import SupplyFormInputs from './components/supply-form-inputs';
import SupplyTokenInfoCard from './components/supply-token-info-card';
import SupplyFormAPR from './components/supply-form-apr';
import SupplyFormPriceBreakdownCard from './components/supply-form-price-breakdown-card';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SupplyFormProps {
	token: {
		name: string;
		symbol: string;
		address: string;
		iconUrl: string;
		decimals: number;
	};
}

/**
 * Form component for supplying tokens to the protocol
 */
function SupplyForm({ token }: SupplyFormProps) {
	return (
		<SupplyFormContextProvider token={token}>
			<SupplyFormContent />
		</SupplyFormContextProvider>
	);
}

/**
 * The actual content of the supply form that uses the store
 */
function SupplyFormContent() {
	// Get handlers from the hook
	const { handleSupply, token, amount, closeDrawer, isLoading } =
		useSupplyForm();

	// If token is not set, don't render anything
	if (!token) return null;

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Supply</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<SupplyFormInputs />
					<Card className='flex flex-col gap-3 p-6 bg-card-bold'>
						<SupplyTokenInfoCard />
						<Separator />
						<SupplyFormAPR />
						<Separator />
						<SupplyFormPriceBreakdownCard />
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				<ConnectedBtn.Primary
					onClick={handleSupply}
					disabled={!amount || isLoading}
					showConnectButton
					parentWidth>
					{isLoading ? 'Processing...' : `Supply ${token.symbol}`}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default SupplyForm;
