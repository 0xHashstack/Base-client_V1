import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SingleSelect } from '@/components/ui/select/single-select';
import { Text } from '@/components/ui/typography/Text';
import { useSupplyFormInputs } from '@/features/earn/hooks/useSupplyFormInputs';
import { HstkToken } from '@/types/web3/token.types';
import Image from 'next/image';
import React from 'react';

function SupplyFormInputs() {
	const {
		amount,
		sliderPercentage,
		token,
		tokens,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
	} = useSupplyFormInputs();

	// Custom render function for token options
	const renderTokenOption = (option: HstkToken, isSelected: boolean) => (
		<div
			className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}>
			<Image
				src={option.iconUrl}
				alt={option.symbol}
				className='rounded-full'
				width={18}
				height={18}
			/>
			<Text.Regular14>{option.symbol}</Text.Regular14>
		</div>
	);

	// Custom render function for selected token
	const renderTokenValue = (selectedToken: HstkToken | null) => {
		if (!selectedToken) return null;
		return (
			<div className='flex items-center gap-2'>
				<Image
					src={selectedToken.iconUrl}
					alt={selectedToken.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<Text.Regular14>{selectedToken.symbol}</Text.Regular14>
			</div>
		);
	};

	return (
		<Card className='flex flex-col gap-4 p-4'>
			<SingleSelect
				label='Token'
				options={tokens}
				value={token}
				valueKey='address'
				labelKey='symbol'
				placeholder='Select a token'
				renderOption={renderTokenOption}
				renderValue={renderTokenValue}
				onChange={handleTokenChange}
			/>

			<Input
				label='Amount'
				type='number'
				value={amount}
				onChange={handleAmountChange}
				placeholder='0.0'
				suffix={
					<button
						onClick={handleMaxClick}
						className='text-primary text-sm hover:underline'>
						MAX
					</button>
				}
			/>

			<div className='flex flex-col gap-1.5'>
				<Slider
					value={[sliderPercentage]}
					max={100}
					step={1}
					onValueChange={handleSliderChange}
					className='mt-1'
				/>
				<div className='flex items-center justify-between'>
					<Text.Regular10>0%</Text.Regular10>
					<Text.Regular10>100%</Text.Regular10>
				</div>
			</div>
		</Card>
	);
}

export default SupplyFormInputs;
