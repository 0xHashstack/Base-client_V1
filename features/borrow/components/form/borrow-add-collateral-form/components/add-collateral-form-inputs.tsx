import { Card } from '@/components/ui/card';
import { CustomInput } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SingleSelect } from '@/components/ui/select/single-select';
import { Text } from '@/components/ui/typography/Text';
import { useBorrowAddCollateralFormInputs } from '@/features/borrow/hooks/useBorrowAddCollateralFormInputs';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { Btn } from '@/components/ui/button';
import { BorrowMarketCollateral } from '@/types/web3/borrow-market.types';

/**
 * Component for the add collateral form inputs
 */
function AddCollateralFormInputs() {
	const {
		amount,
		sliderPercentage,
		userLoan,
		filteredCollateralOptions,
		handleAmountChange,
		handleMaxClick,
		handleSliderChange,
		handleTokenChange,
		refetchWalletBalance,
		formattedWalletBalance,
		walletBalanceLoading,
		walletBalanceError,
		isFormDisabled,
		collateralAsset,
	} = useBorrowAddCollateralFormInputs();

	// Custom render function for token options
	const renderTokenOption = (
		option: BorrowMarketCollateral,
		isSelected: boolean
	) => {
		return (
			<div
				className={`flex items-center gap-2 px-3 py-2 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'} rounded-lg`}>
				<Image
					src={option?.logoURI || ''}
					alt={option.name}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<Text.Regular14>{option.name}</Text.Regular14>
			</div>
		);
	};

	// Custom render function for selected token
	const renderTokenValue = (selectedToken: BorrowMarketCollateral | null) => {
		return (
			<div className='flex items-center gap-2'>
				<Image
					src={selectedToken?.logoURI || ''}
					alt={selectedToken?.name || ''}
					className='rounded-full'
					width={18}
					height={18}
				/>
				<Text.Medium14>{selectedToken?.name || ''}</Text.Medium14>
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
				{userLoan?.collateralAsset.name || ''}
			</Text.Regular12>
		);
	};

	return (
		<div className='flex flex-col gap-5'>
			<Card className='flex flex-col gap-3 px-6 py-4'>
				<SingleSelect
					label='Collateral Asset'
					options={filteredCollateralOptions}
					value={collateralAsset}
					valueKey='address'
					labelKey='symbol'
					placeholder='Select a token'
					renderOption={renderTokenOption}
					renderValue={renderTokenValue}
					onChange={(_, collateralAsset) =>
						handleTokenChange(collateralAsset)
					}
					className='border-none p-0 shadow-none ring-0'
					dropdownClassName='select-primary-displacement'
					disabled={isFormDisabled} // Disable token selection since we're using the loan's collateral
				/>
			</Card>
			<Card className='flex flex-col gap-6 p-6'>
				<div className='flex flex-col gap-4'>
					<div className='flex justify-between items-center'>
						<Text.Regular12 textColor={600}>Amount</Text.Regular12>
					</div>
					<div className='flex w-full flex-col items-end'>
						<div className='flex items-center gap-1 justify-between w-full'>
							<div className='flex-1'>
								<CustomInput.Amount
									autoFocus
									type='number'
									value={amount}
									onChange={handleAmountChange}
									placeholder={`00.00 ${userLoan?.collateralAsset.name || ''}`}
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
		</div>
	);
}

export default AddCollateralFormInputs;
