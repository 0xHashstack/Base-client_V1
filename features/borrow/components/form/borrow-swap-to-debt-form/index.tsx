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
	const { handleSwapToDebt, marketLoan, closeDrawer, getButtonText, amount } =
		useBorrowSwapToDebtForm();

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
					<Card className='p-6 bg-card-bold'>
						<div className='flex flex-col gap-4'>
							<div>
								<Text.Regular12 className='text-gray-500 mb-2'>
									Select Token
								</Text.Regular12>
								{/* <TokenSelector
									selectedToken={selectedToken}
									onSelect={(token) =>
										setSelectedToken({
											address:
												token.address as Web3Address,
											symbol: token.symbol,
											decimals: token.decimals,
										})
									}
								/> */}
							</div>
						</div>
					</Card>

					{/* Loan details card */}
					<Card className='p-6 bg-card-bold'>
						<div className='flex flex-col gap-3'>
							<div className='flex justify-between'>
								<Text.Regular12 className='text-gray-500'>
									Current Debt
								</Text.Regular12>
								<Text.Regular12>
									{marketLoan.positionHealth.healthFactor.formatToString(
										DECIMALS.HEALTH_FACTOR
									)}{' '}
									{marketLoan.borrowedAsset.symbol}
								</Text.Regular12>
							</div>

							<div className='flex justify-between'>
								<Text.Regular12 className='text-gray-500'>
									Health Factor
								</Text.Regular12>
								<Text.Regular12>
									{marketLoan.positionHealth.healthFactor.formatToString(
										DECIMALS.HEALTH_FACTOR
									)}{' '}
								</Text.Regular12>
							</div>

							<div className='flex justify-between'>
								<Text.Regular12 className='text-gray-500'>
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

					{/* Price breakdown card */}

					<Card className='p-6 bg-card-bold'>
						<div className='flex flex-col gap-3'>
							<div className='flex justify-between'>
								<Text.Regular12 className='text-gray-500'>
									Estimated Debt Increase
								</Text.Regular12>
								<Text.Regular12>
									{amount} {marketLoan.borrowedAsset.symbol}
								</Text.Regular12>
							</div>
						</div>
					</Card>
				</div>
			</SideDrawer.Body>
			<SideDrawer.Footer>
				<ConnectedBtn.Primary
					onClick={handleSwapToDebt}
					showConnectButton
					parentWidth>
					{getButtonText()}
				</ConnectedBtn.Primary>
			</SideDrawer.Footer>
		</>
	);
}

export default BorrowSwapToDebt;
