'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { ConnectedBtn } from '@/components/ui/button';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import SideDrawer from '@/components/drawer/side-drawer';
import { SupplyFormContextProvider } from '../../../context/supply-form.context';
import { useSupplyForm } from '../../../hooks/useSupplyForm';
import SupplyFormInputs from './components/supply-form-inputs';

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
				<Text.Medium16>Supply {token.symbol}</Text.Medium16>
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

					<SupplyFormInputs />

					<div className='flex flex-col gap-4 mt-4'>
						<div className='flex justify-between'>
							<Text.Regular14>Supply APY</Text.Regular14>
							<Text.Regular14>3.5%</Text.Regular14>
						</div>

						<div className='flex justify-between'>
							<Text.Regular14>Collateral Factor</Text.Regular14>
							<Text.Regular14>75%</Text.Regular14>
						</div>
					</div>
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
