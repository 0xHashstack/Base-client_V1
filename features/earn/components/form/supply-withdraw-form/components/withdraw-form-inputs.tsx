import { Card } from '@/components/ui/card';
import { CustomInput } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SingleSelect } from '@/components/ui/select/single-select';
import { Text } from '@/components/ui/typography/Text';
import { useWithdrawFormInputs } from '@/features/earn/hooks/useWithdrawFormInputs';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { ArrowsClockwise } from '@phosphor-icons/react';
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
		handleRefreshBalance,
		formattedWalletBalance,
		walletBalanceLoading,
		walletBalanceError,
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

	// Render wallet balance based on loading/error state
	const renderWalletBalance = () => {
		if (walletBalanceLoading) {
			return <Skeleton className='h-4 w-24' />;
		}

		if (walletBalanceError) {
			return (
				<div className='flex items-center gap-1 text-destructive'>
					<Text.Regular12>
						Failed to load Wallet Balance
					</Text.Regular12>
					<button
						onClick={handleRefreshBalance}
						className='text-destructive hover:text-destructive/80'>
						<ArrowsClockwise size={14} />
					</button>
				</div>
			);
		}

		return (
			<Text.Regular12 textColor={600}>
				Wallet Balance: {formattedWalletBalance}{' '}
				{position?.supplyAsset.symbol || ''}
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
							{renderWalletBalance()}
						</div>
					</div>
				</div>
				<div className='flex gap-1 items-center'>
					<Text.Regular12 textColor={600}>
						Available supply:
					</Text.Regular12>
					<Text.Regular12>
						Todo: need to add
						{position?.supplyAsset.symbol || ''}
					</Text.Regular12>
				</div>
				<div className='flex flex-col gap-2.5'>
					<Slider
						value={[sliderPercentage]}
						max={100}
						step={1}
						onValueChange={handleSliderChange}
						className='mt-1'
						disabled={isFormDisabled}
					/>
					<div className='flex items-center justify-between'>
						<Text.Regular10>0%</Text.Regular10>
						<Text.Regular10>25%</Text.Regular10>
						<Text.Regular10>50%</Text.Regular10>
						<Text.Regular10>75%</Text.Regular10>
						<Text.Regular10>100%</Text.Regular10>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default WithdrawFormInputs;
