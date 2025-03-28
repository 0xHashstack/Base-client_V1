import { Card } from '@/components/ui/card';
import { CustomInput } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SingleSelect } from '@/components/ui/select/single-select';
import { Text } from '@/components/ui/typography/Text';
import { useBorrowFormInputs } from '@/features/borrow/hooks/useBorrowFormInputs';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { Btn } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	BorrowMarketCollateral,
	MarketLoan,
} from '@/types/web3/borrow-market.types';

/**
 * Component for the borrow form inputs
 */
function BorrowFormInputs() {
	const {
		amount,
		sliderPercentage,
		collateralMarket,
		collateralMarketList,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
		refetchWalletBalance,
		formattedWalletBalance,
		walletBalanceLoading,
		walletBalanceError,
		isFormDisabled,
		// Borrow market related
		borrowAmount,
		borrowMarket,
		borrowMarketList,
		borrowSliderPercentage,
		availableReserve,
		handleBorrowAmountChange,
		handleBorrowMaxClick,
		handleBorrowMarketChange,
		handleBorrowSliderChange,
	} = useBorrowFormInputs();

	// Custom render function for token options
	const renderTokenOption = (
		option: BorrowMarketCollateral,
		isSelected: boolean
	) => (
		<div
			className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} rounded-lg`}>
			<Image
				src={option.logoURI}
				alt={option.symbol}
				className='rounded-full'
				width={18}
				height={18}
			/>
			<Text.Regular14>{option.symbol}</Text.Regular14>
		</div>
	);

	// Custom render function for selected token
	const renderTokenValue = (selectedToken: BorrowMarketCollateral | null) => {
		if (!selectedToken) return null;
		return (
			<div className='flex items-center gap-2'>
				<Image
					src={selectedToken.logoURI}
					alt={selectedToken.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<Text.Medium14>{selectedToken.symbol}</Text.Medium14>
			</div>
		);
	};

	// Custom render function for borrow market token options
	const renderBorrowMarketOption = (
		option: MarketLoan,
		isSelected: boolean
	) => (
		<div
			className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} rounded-lg`}>
			<Image
				src={option.asset.logoURI}
				alt={option.asset.symbol}
				className='rounded-full'
				width={18}
				height={18}
			/>
			<Text.Regular14>{option.asset.symbol}</Text.Regular14>
		</div>
	);

	// Custom render function for selected borrow market token
	const renderBorrowMarketValue = (selectedToken: MarketLoan | null) => {
		if (!selectedToken) return null;
		return (
			<div className='flex items-center gap-2'>
				<Image
					src={selectedToken.asset.logoURI}
					alt={selectedToken.asset.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<Text.Medium14>{selectedToken.asset.symbol}</Text.Medium14>
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
						onClick={() => refetchWalletBalance()}
						className='text-destructive hover:text-destructive/80'>
						<ArrowsClockwise size={14} />
					</button>
				</div>
			);
		}

		return (
			<Text.Regular12 textColor={600}>
				Wallet Balance: {formattedWalletBalance}{' '}
				{collateralMarket?.symbol || ''}
			</Text.Regular12>
		);
	};

	return (
		<div className='flex flex-col gap-5'>
			{/* Borrow Market Selector */}
			<Card className='flex flex-col gap-3 px-6 py-4'>
				<SingleSelect
					label='Borrow Market'
					options={borrowMarketList}
					value={borrowMarket}
					valueKey='address_'
					labelKey='symbol'
					placeholder='Select a token'
					renderOption={renderBorrowMarketOption}
					renderValue={renderBorrowMarketValue}
					onChange={(_, value) => handleBorrowMarketChange(value)}
					className='border-none p-0 shadow-none ring-0'
					dropdownClassName='select-primary-displacement'
				/>
			</Card>

			{/* Borrow Amount Input */}
			<Card className='flex flex-col gap-6 p-6'>
				<div className='flex flex-col gap-4'>
					<Text.Regular12 textColor={500}>
						Borrow Amount
					</Text.Regular12>
					<div className='flex w-full flex-col items-end'>
						<div className='flex items-center gap-1 justify-between w-full'>
							<div className='flex-1'>
								<CustomInput.Amount
									type='number'
									value={borrowAmount}
									onChange={handleBorrowAmountChange}
									placeholder={`00.00 ${borrowMarket?.asset.symbol || ''}`}
									disabled={!borrowMarket}
								/>
							</div>

							<Btn.Self
								onClick={handleBorrowMaxClick}
								className='text-link'
								disabled={!borrowMarket}>
								MAX
							</Btn.Self>
						</div>
						<div className='flex items-center gap-1'>
							<Text.Regular12 textColor={600}>
								Available Reserve: {availableReserve}{' '}
								{borrowMarket?.asset.symbol || ''}
							</Text.Regular12>
						</div>
					</div>
				</div>
				<div className='flex flex-col gap-2.5'>
					<Slider
						value={[borrowSliderPercentage]}
						max={100}
						step={1}
						onValueChange={handleBorrowSliderChange}
						className='mt-1'
						disabled={!borrowMarket}
						fixedStepsPercentage={[0, 25, 50, 75, 100]}
						onStepClick={(value) =>
							handleBorrowSliderChange([value])
						}
					/>
				</div>
			</Card>
			<Separator className='bg-border' />
			<Card className='flex flex-col gap-3 px-6 py-4'>
				<SingleSelect
					label='Collateral Market'
					options={collateralMarketList}
					value={collateralMarket}
					valueKey='address'
					labelKey='symbol'
					placeholder='Select a token'
					renderOption={renderTokenOption}
					renderValue={renderTokenValue}
					onChange={(_, value) => handleTokenChange(value)}
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
									placeholder={`00.00 ${collateralMarket?.symbol || ''}`}
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
			<Separator className='bg-border' />
		</div>
	);
}

export default BorrowFormInputs;
