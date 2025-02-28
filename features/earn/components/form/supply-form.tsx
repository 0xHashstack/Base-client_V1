'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { ConnectedBtn } from '@/components/ui/button';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';
import { Input } from '@/components/ui/input';
import SideDrawer from '@/components/drawer/side-drawer';
import {
	SupplyFormContextProvider,
	useSupplyFormStore,
} from '../../context/supply-form.context';
import { useSupplyForm } from '../../hooks/useSupplyForm';

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
	const { closeDrawer } = useEarnDrawer();

	// Get state from the store using selectors
	const amount = useSupplyFormStore((state) => state.amount);
	const isLoading = useSupplyFormStore((state) => state.isLoading);
	const token = useSupplyFormStore((state) => state.token);

	// Get handlers from the hook
	const { handleAmountChange, handleMaxClick, handleSupply } =
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
				<div className='flex-1 flex flex-col'>
					<div className='flex items-center gap-2 mb-2'>
						<ImageWithLoader
							src={token.iconUrl}
							alt={token.name}
							width={24}
							height={24}
						/>
						<Text.Regular16>{token.name}</Text.Regular16>
					</div>

					<div className='flex flex-col gap-2'>
						<div className='flex justify-between items-center'>
							<Text.Regular14>Amount</Text.Regular14>
							<button
								onClick={handleMaxClick}
								className='text-primary text-sm hover:underline'>
								MAX
							</button>
						</div>

						<div className='relative'>
							<Input
								type='number'
								value={amount}
								onChange={handleAmountChange}
								placeholder='0.0'
								className='w-full p-3'
							/>
							<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
								<Text.Regular14>{token.symbol}</Text.Regular14>
							</div>
						</div>
					</div>

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

					<ConnectedBtn.Primary
						onClick={handleSupply}
						disabled={!amount || isLoading}
						className='w-full mt-4'>
						{isLoading ? 'Processing...' : `Supply ${token.symbol}`}
					</ConnectedBtn.Primary>
				</div>
			</SideDrawer.Body>
		</>
	);
}

export default SupplyForm;
