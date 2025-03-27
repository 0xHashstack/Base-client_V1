import { Card } from '@/components/ui/card';
import { CustomInput } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SingleSelect } from '@/components/ui/select/single-select';
import { Text } from '@/components/ui/typography/Text';
import { useWithdrawFormInputs } from '@/features/earn/hooks/useWithdrawFormInputs';
import Image from 'next/image';
import React from 'react';
import { Btn } from '@/components/ui/button';
import { SupplyPosition } from '@/types/web3/supply-market.types';

/**
 * Component for the withdraw form inputs
 */
function WithdrawFormInputs() {
	const {
		amount,
		sliderPercentage,
		position,
		supplyPositions,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,

		formattedAvailableBalance,
		isFormDisabled,
	} = useWithdrawFormInputs();

	// Custom render function for token options
	const renderTokenOption = (option: SupplyPosition, isSelected: boolean) => (
		<div
			className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} rounded-lg`}>
			<Image
				src={option.underlyingAsset.logoURI}
				alt={option.supplyAsset.symbol}
				className='rounded-full'
				width={18}
				height={18}
			/>
			<Text.Regular14>{option.supplyAsset.symbol}</Text.Regular14>
		</div>
	);

	// Custom render function for selected token
	const renderTokenValue = (selectedToken: SupplyPosition | null) => {
		if (!selectedToken) return null;
		return (
			<div className='flex items-center gap-2'>
				<Image
					src={selectedToken.underlyingAsset.logoURI}
					alt={selectedToken.supplyAsset.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<Text.Medium14>
					{selectedToken.supplyAsset.symbol}
				</Text.Medium14>
			</div>
		);
	};

	// Render available balance based on loading/error state
	const renderAvailableBalance = () => {
		return (
			<Text.Regular12 textColor={600}>
				Available Balance: {formattedAvailableBalance}{' '}
				{position?.supplyAsset.symbol}
			</Text.Regular12>
		);
	};

	return (
		<div className='flex flex-col gap-5'>
			<Card className='flex flex-col gap-3 px-6 py-4'>
				<SingleSelect
					label='Select Market'
					options={supplyPositions}
					value={position}
					valueKey='supplyAsset.address_'
					placeholder='Select a token'
					renderOption={renderTokenOption}
					renderValue={renderTokenValue}
					onChange={handleTokenChange}
					className='border-none p-0 shadow-none ring-0'
					dropdownClassName='select-primary-displacement'
				/>
			</Card>
			<Card className='flex flex-col gap-6 p-6'>
				<div className='flex flex-col gap-4'>
					<Text.Regular12 textColor={500}>Amount</Text.Regular12>
					<div className='flex w-full flex-col items-end'>
						<div className='flex items-center gap-1 justify-between w-full'>
							<div className='flex-1'>
								<CustomInput.Amount
									autoFocus
									type='number'
									value={amount}
									onChange={handleAmountChange}
									placeholder={`00.00 ${position?.supplyAsset.symbol || ''}`}
									disabled={isFormDisabled}
								/>
							</div>
							<Btn.Self
								onClick={handleMaxClick}
								className='text-link'
								disabled={isFormDisabled}>
								MAX
							</Btn.Self>
						</div>
						<div className='flex items-center gap-1'>
							{renderAvailableBalance()}
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-2.5'>
					<Slider
						value={[sliderPercentage]}
						max={100}
						step={1}
						onValueChange={handleSliderChange}
						className='mt-1'
						disabled={isFormDisabled}
						fixedStepsPercentage={[0, 25, 50, 75, 100]}
						onStepClick={(value) => handleSliderChange([value])}
					/>
				</div>
			</Card>
		</div>
	);
}

export default WithdrawFormInputs;
