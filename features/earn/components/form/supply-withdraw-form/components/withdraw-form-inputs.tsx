'use client';
import React, { useMemo } from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useSupplyWithdrawForm } from '../../../../hooks/useSupplyWithdrawForm';
import { Card } from '@/components/ui/card';

/**
 * Component for the withdraw form inputs
 */
const WithdrawFormInputs: React.FC = () => {
	const { amount, setAmount, token } = useSupplyWithdrawForm();

	// Calculate the percentage based on amount
	const percentage = useMemo(() => {
		if (!amount) return 0;
		// This would be replaced with actual balance calculation
		const maxAmount = 1000;
		return Math.min(
			Math.floor((parseFloat(amount) / maxAmount) * 100),
			100
		);
	}, [amount]);

	// Handle slider change
	const handleSliderChange = (value: number[]) => {
		// This would be replaced with actual balance calculation
		const maxAmount = 1000;
		const newAmount = ((value[0] / 100) * maxAmount).toString();
		setAmount(newAmount);
	};

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value);
	};

	return (
		<Card className='flex flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<Text.Regular14>Amount</Text.Regular14>
				<Text.Regular14>
					Available:{' '}
					<span className='text-primary-500'>
						1000 {token?.symbol}
					</span>
				</Text.Regular14>
			</div>

			<Input
				value={amount}
				onChange={handleInputChange}
				placeholder='0.0'
				type='number'
				min='0'
				step='0.01'
				className='w-full'
			/>

			<div className='flex flex-col gap-1.5'>
				<Slider
					value={[percentage]}
					onValueChange={handleSliderChange}
					showTooltip
				/>

				<div className='flex items-center justify-between'>
					<Text.Regular10>0%</Text.Regular10>
					<Text.Regular10>100%</Text.Regular10>
				</div>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Medium12>Available Supply</Text.Medium12>
				<Text.Medium12>103.2 {token?.symbol}</Text.Medium12>
			</div>
		</Card>
	);
};

export default WithdrawFormInputs;
