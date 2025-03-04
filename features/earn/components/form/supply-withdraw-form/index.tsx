'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { ConnectedBtn } from '@/components/ui/button';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import SideDrawer from '@/components/drawer/side-drawer';
import { SupplyWithdrawFormContextProvider } from '../../../context/supply-withdraw-form.context';
import { useSupplyWithdrawForm } from '../../../hooks/useSupplyWithdrawForm';
import WithdrawFormInputs from './components/withdraw-form-inputs';
import WithdrawTokenInfoCard from './components/withdraw-token-info-card';
import WithdrawFormAPR from './components/withdraw-form-apr';
import WithdrawFormPriceBreakdownCard from './components/withdraw-form-price-breakdown-card';

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
				<Text.Medium16>Withdraw {token.symbol}</Text.Medium16>
				<button
					onClick={closeDrawer}
					className='text-gray-500 hover:text-gray-700'>
					✕
				</button>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					<div className='flex items-center gap-2 mb-2'>
						<ImageWithLoader
							src={token.iconUrl}
							alt={token.name}
							width={24}
							height={24}
						/>
						<Text.Regular16>{token.name}</Text.Regular16>
					</div>

					<WithdrawFormInputs />
					<WithdrawTokenInfoCard />
					<WithdrawFormAPR />
					<WithdrawFormPriceBreakdownCard />
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
