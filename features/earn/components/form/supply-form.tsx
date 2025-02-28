'use client';
import React, { useState } from 'react';
import { Text } from '@/components/ui/typography/Text';
import { ConnectedBtn } from '@/components/ui/button';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';
import { Input } from '@/components/ui/input';
import SideDrawer from '@/components/drawer/side-drawer';

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
	const { closeDrawer } = useEarnDrawer();
	const [amount, setAmount] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Handle amount change
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value);
	};

	// Handle max button click
	const handleMaxClick = () => {
		// In a real implementation, this would set the max available balance
		setAmount('1000');
	};

	// Handle supply submission
	const handleSupply = async () => {
		try {
			setIsLoading(true);
			// In a real implementation, this would call the contract to supply tokens
			console.log(`Supplying ${amount} ${token.symbol}`);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Close the drawer after successful supply
			closeDrawer();
		} catch (error) {
			console.error('Error supplying tokens:', error);
		} finally {
			setIsLoading(false);
		}
	};

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
