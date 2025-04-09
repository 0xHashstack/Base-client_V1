import { Card } from '@/components/ui/card';
import { CustomInput } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SingleSelect } from '@/components/ui/select/single-select';
import { Text } from '@/components/ui/typography/Text';
import { useBorrowRepayFormInputs } from '@/features/borrow/hooks/useBorrowRepayFormInputs';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { Btn } from '@/components/ui/button';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { LoanPosition } from '@/types/web3/borrow-market.types';

/**
 * Component for the borrow repay form inputs
 */
function BorrowRepayFormInputs() {
	const {
		sliderPercentage,
		borrowMarket,
		userLoans,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
		refetchWalletBalance,
		formattedWalletBalance,
		walletBalanceLoading,
		walletBalanceError,
		repayAmount,
		isFormDisabled,
	} = useBorrowRepayFormInputs();

	// Custom render function for token options
	const renderTokenOption = (option: LoanPosition, isSelected: boolean) => (
		<div
			className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}  rounded-lg`}>
			<Image
				src={option.borrowedAsset.logoURI}
				alt={option.borrowedAsset.symbol}
				className='rounded-full'
				width={18}
				height={18}
			/>
			<Text.Regular14>{option.borrowedAsset.symbol}</Text.Regular14>
		</div>
	);

	// Custom render function for selected token
	const renderTokenValue = (selectedToken: LoanPosition | null) => {
		if (!selectedToken) return null;
		return (
			<div className='flex items-start gap-2'>
				<Image
					src={selectedToken.borrowedAsset.logoURI}
					alt={selectedToken.borrowedAsset.symbol}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<div className='flex flex-col'>
					<Text.Medium14>
						{selectedToken.borrowedAsset.symbol}
					</Text.Medium14>
					<Text.Regular12 textColor={600}>
						Borrow balance: $
						{borrowMarket?.borrowedValue.formatBalance(
							DECIMALS.PRICE
						)}
					</Text.Regular12>
				</div>
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
				{borrowMarket?.borrowedAsset.symbol || ''}
			</Text.Regular12>
		);
	};

	return (
		<div className='flex flex-col gap-5'>
			<Card className='flex flex-col gap-3 px-6 py-4'>
				<SingleSelect
					label='Borrow Market'
					options={userLoans}
					value={borrowMarket}
					valueKey='borrowedAsset.address_'
					labelKey='symbol'
					placeholder='Select a market'
					disabled={isFormDisabled}
					renderOption={renderTokenOption}
					renderValue={renderTokenValue}
					onChange={handleTokenChange}
					className='border-none p-0 shadow-none ring-0'
					dropdownClassName='select-primary-displacement'
				/>
			</Card>
			<Card className='flex flex-col gap-6 p-6'>
				<div className='flex flex-col gap-4'>
					<Text.Regular12 textColor={600}>
						Repay Amount
					</Text.Regular12>
					<div className='flex w-full flex-col items-end'>
						<div className='flex items-center gap-1 justify-between w-full'>
							<div className='flex-1'>
								<CustomInput.Amount
									autoFocus
									type='number'
									value={repayAmount}
									onChange={handleAmountChange}
									placeholder={`00.00 ${borrowMarket?.borrowedAsset.symbol || ''}`}
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

export default BorrowRepayFormInputs;
