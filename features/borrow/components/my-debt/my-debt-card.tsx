import { Btn } from '@/components/ui/button';
import { useBorrowDrawer } from '../../context/borrow-drawer.context';
import PrimaryCard from '@/components/ui/card/primary-card';
import { Text } from '@/components/ui/typography/Text';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import React, { useMemo, useCallback } from 'react';
import {
	LoanPosition,
	LoanUsageStatus,
} from '@/types/web3/borrow-market.types';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import BorrowAddCollateralForm from '../form/borrow-add-collateral-form';
import BorrowSpendForm from '../form/borrow-spend-form';
import BorrowRepayForm from '../form/borrow-repay-form';
import '@prototype/bigint.prototype';
import If from '@/components/common/If';

interface MyDebtCardProps {
	loanPosition: LoanPosition;
}

function MyDebtCard({ loanPosition }: MyDebtCardProps) {
	const { openDrawer, setDrawerContent } = useBorrowDrawer();

	// Calculate values from loan position
	const borrowedAmount = loanPosition.borrowedValue.formatBalance(
		DECIMALS.PRICE
	);
	const borrowAPR = loanPosition.rateInfo.effectiveRate.formatToString(
		DECIMALS.APR
	);
	const healthFactor =
		loanPosition.positionHealth.healthFactor.formatToString(
			DECIMALS.HEALTH_FACTOR
		);

	// Handle adding collateral
	const handleAddCollateral = useCallback(() => {
		setDrawerContent(
			<BorrowAddCollateralForm loanPosition={loanPosition} />
		);
		openDrawer();
	}, [loanPosition, setDrawerContent, openDrawer]);

	// Handle spending borrowed assets
	const handleSpend = useCallback(() => {
		setDrawerContent(<BorrowSpendForm marketLoan={loanPosition} />);
		openDrawer();
	}, [loanPosition, setDrawerContent, openDrawer]);

	// Handle repaying debt
	const handleRepay = useCallback(() => {
		setDrawerContent(<BorrowRepayForm marketLoan={loanPosition} />);
		openDrawer();
	}, [loanPosition, setDrawerContent, openDrawer]);

	const cardData = useMemo<
		{
			title: string;
			value: string;
		}[]
	>(
		() => [
			{
				title: 'Debt',
				value: `$${borrowedAmount}`,
			},
			{
				title: 'APR',
				value: `${borrowAPR}%`,
			},
			{
				title: 'Health Factor',
				value: healthFactor,
			},
		],
		[borrowedAmount, borrowAPR, healthFactor]
	);

	return (
		<PrimaryCard>
			<PrimaryCard.Header>
				<div className='flex items-center gap-3'>
					<ImageWithLoader
						src={loanPosition.borrowedAsset.logoURI || ''}
						alt={loanPosition.borrowedAsset.name || ''}
						width={24}
						height={24}
						className='rounded-full'
					/>
					<Text.Semibold20>
						{loanPosition.borrowedAsset.name}
					</Text.Semibold20>
				</div>
			</PrimaryCard.Header>
			<PrimaryCard.Body>
				<div className='flex flex-col gap-5'>
					{cardData.map((item) => (
						<div
							key={item.title}
							className='flex items-center justify-between gap-1'>
							<Text.Regular14 className='text-muted-foreground'>
								{item.title}
							</Text.Regular14>
							<Text.Regular14>{item.value}</Text.Regular14>
						</div>
					))}
				</div>
				<div className='flex flex-col gap-2 w-full mt-2'>
					<Btn.Primary onClick={handleRepay}>Repay</Btn.Primary>
					<div className='grid grid-cols-2 gap-2'>
						<If
							isTrue={
								Number(loanPosition.usageDetails.status) ===
								LoanUsageStatus.SPENT
							}>
							<Btn.Secondary onClick={handleSpend}>
								Swap To Debt
							</Btn.Secondary>
							<Btn.Secondary onClick={handleSpend}>
								Spend
							</Btn.Secondary>
						</If>
						<Btn.Secondary onClick={handleAddCollateral}>
							Add Collateral
						</Btn.Secondary>
					</div>
				</div>
			</PrimaryCard.Body>
		</PrimaryCard>
	);
}

export default MyDebtCard;
