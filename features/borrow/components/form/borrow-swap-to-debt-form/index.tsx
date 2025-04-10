'use client';
import React from 'react';
import { Text } from '@/components/ui/typography/Text';
import { Btn, ConnectedBtn } from '@/components/ui/button';
import SideDrawer from '@/components/drawer/side-drawer';
import { BorrowSwapToDebtFormContextProvider } from '../../../context/borrow-swap-to-debt-form.context';
import { useBorrowSwapToDebtForm } from '../../../hooks/useBorrowSwapToDebtForm';
import { Card } from '@/components/ui/card';
import { LoanPosition } from '@/types/web3/borrow-market.types';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { SingleSelect } from '@/components/ui/select/single-select';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';

interface BorrowSwapToDebtFormProps {
	marketLoan: LoanPosition;
}

/**
 * Form component for swapping tokens to debt
 */
function BorrowSwapToDebt({ marketLoan }: BorrowSwapToDebtFormProps) {
	return (
		<BorrowSwapToDebtFormContextProvider marketLoan={marketLoan}>
			<BorrowSwapToDebtFormContent />
		</BorrowSwapToDebtFormContextProvider>
	);
}

/**
 * The actual content of the borrow swap to debt form that uses the store
 */
function BorrowSwapToDebtFormContent() {
	// Get handlers and state from the hook
	const {
		handleSwapToDebt,
		marketLoan,
		closeDrawer,
		getButtonText,
		userInvestedLoans,
		setMarketLoan,
		isButtonDisabled,
	} = useBorrowSwapToDebtForm();

	/**
	 * Render token option in dropdown
	 */
	const renderTokenOption = (loan: LoanPosition) => {
		return (
			<div className='flex items-center gap-2'>
				{loan.borrowedAsset.logoURI && (
					<ImageWithLoader
						src={loan.borrowedAsset.logoURI}
						alt={loan.borrowedAsset.symbol || ''}
						width={20}
						height={20}
						className='rounded-full'
					/>
				)}
				<div className='flex flex-col'>
					<Text.Medium14>{loan.borrowedAsset.symbol}</Text.Medium14>
					<Text.Regular12 textColor={600}>
						{loan.borrowedValue.formatBalance(DECIMALS.PRICE)} USD
					</Text.Regular12>
				</div>
			</div>
		);
	};

	/**
	 * Render selected token value
	 */
	const renderTokenValue = (loan: LoanPosition) => {
		return (
			<div className='flex items-center gap-2'>
				{loan.borrowedAsset.logoURI && (
					<ImageWithLoader
						src={loan.borrowedAsset.logoURI}
						alt={loan.borrowedAsset.symbol || ''}
						width={20}
						height={20}
						className='rounded-full'
					/>
				)}
				<Text.Medium14>{loan.borrowedAsset.symbol}</Text.Medium14>
			</div>
		);
	};

	/**
	 * Handle token change
	 */
	const handleTokenChange = (loan: LoanPosition) => {
		if (loan) {
			setMarketLoan(loan);
		}
	};

	// If market loan is not set, don't render anything
	if (!marketLoan) return null;

	return (
		<>
			<SideDrawer.Header>
				<Text.Semibold20>Swap to Debt</Text.Semibold20>
				<Btn.Outline
					onClick={closeDrawer}
					className='text-primary-500 hover:text-gray-700 h-7 w-7 p-0'>
					✕
				</Btn.Outline>
			</SideDrawer.Header>
			<SideDrawer.Body>
				<div className='flex-1 flex flex-col gap-4'>
					{/* Token selection and amount input */}
					<Card className='flex flex-col gap-3 px-6 py-4'>
						<SingleSelect
							label='Select Loan'
							options={userInvestedLoans}
							value={marketLoan}
							valueKey='loanId'
							labelKey='borrowedAsset.symbol'
							placeholder='Select a loan to swap to debt'
							renderOption={renderTokenOption}
							renderValue={renderTokenValue}
							onChange={handleTokenChange}
							className='border-none p-0 shadow-none ring-0'
							dropdownClassName='select-primary-displacement'
						/>
					</Card>

					{/* Loan details card */}
					<Card className='p-6 bg-card-bold'>
						<div className='flex flex-col gap-3'>
							<div className='flex justify-between'>
								<Text.Regular12 className='text-gray-600'>
									Current Debt
								</Text.Regular12>
								<Text.Regular12>
									{marketLoan.debtTokenAmount.formatBalance(
										marketLoan.borrowedAsset.decimals
									)}{' '}
									{marketLoan.borrowedAsset.symbol}
								</Text.Regular12>
							</div>

							<div className='flex justify-between'>
								<Text.Regular12 className='text-gray-600'>
									Health Factor
								</Text.Regular12>
								<Text.Regular12>
									{marketLoan.positionHealth.healthFactor.formatToString(
										DECIMALS.HEALTH_FACTOR
									)}
								</Text.Regular12>
							</div>

							<div className='flex justify-between'>
								<Text.Regular12 className='text-gray-600'>
									Collateral
								</Text.Regular12>
								<Text.Regular12>
									{marketLoan.collateralAsset.collateralAmount.formatBalance(
										marketLoan.collateralAsset.decimals
									)}{' '}
									{marketLoan.collateralAsset.symbol}
								</Text.Regular12>
							</div>
						</div>
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				<ConnectedBtn.Primary
					onClick={handleSwapToDebt}
					disabled={isButtonDisabled}
					showConnectButton
					parentWidth>
					{getButtonText()}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowSwapToDebt;
