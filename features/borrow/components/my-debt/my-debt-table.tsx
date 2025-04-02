'use client';

import { Btn } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableNoData,
	TableLoader,
} from '@/components/ui/table';
import { useBorrowDrawer } from '../../context/borrow-drawer.context';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import MyDebtQuickStat from '../common/my-debt-quick-stat';
import { Text } from '@/components/ui/typography/Text';
import {
	HoverBorrowAprCard,
	HoverBorrowHealthCard,
	HoverBorrowValueCard,
} from '../card/hover-cards';
import { SpendCategory } from '@/types/web3/borrow.types';
import BorrowAddCollateralForm from '../form/borrow-add-collateral-form';
import BorrowSpendForm from '../form/borrow-spend-form';
import BorrowRepayForm from '../form/borrow-repay-form';
import React, { useCallback, useMemo } from 'react';
import { useTokenStore } from '@/store/useTokenStore';
import {
	LoanPosition,
	LoanUsageStatus,
} from '@/types/web3/borrow-market.types';
import If from '@/components/common/If';
import '@prototype/bigint.prototype';
import { CollateralToken, HstkToken } from '@/types/web3/token.types';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { FEES } from '@/constant/web3/fees.constant';

/**
 * MyDebtTable component
 * Displays a table of the user's active debt positions
 */
function MyDebtTable() {
	const { openDrawer, setDrawerContent } = useBorrowDrawer();
	// Using selector pattern for Zustand stores as per project preference
	const userAllLoans = useTokenStore((state) => state.userAllLoans);
	const isLoadingBorrowMarket = useTokenStore(
		(state) => state.isLoadingBorrowMarket
	);

	// Filter active loans based on status
	const activeLoans = useMemo(() => {
		if (!userAllLoans || userAllLoans.length === 0) return [];

		// Filter loans with active status
		return userAllLoans.filter(
			(loan) =>
				Number(loan.usageDetails.status) === LoanUsageStatus.ACTIVE
		);
	}, [userAllLoans]);

	// Convert LoanPosition to HstkToken for form components
	const convertToHstkToken = (loan: LoanPosition): HstkToken => ({
		name: loan.borrowedAsset.name,
		symbol: loan.borrowedAsset.symbol,
		address: loan.borrowedAsset.address_,
		decimals: loan.borrowedAsset.decimals,
		iconUrl: loan.borrowedAsset.logoURI,
		isNew: false,
		isPaused: false,
	});

	// Convert LoanPosition to CollateralToken for form components
	const convertToCollateralToken = (loan: LoanPosition): CollateralToken => ({
		name: loan.collateralAsset.name,
		symbol: loan.collateralAsset.symbol,
		address: loan.collateralAsset.addr,
		decimals: loan.collateralAsset.decimals,
		iconUrl: '', // CollateralInfo doesn't have logoURI
		availableCollateral: Number(
			loan.collateralAsset.collateralAmount.toString()
		),
	});

	// Handle adding collateral
	const handleAddCollateral = useCallback(
		(loan: LoanPosition) => {
			setDrawerContent(
				<BorrowAddCollateralForm
					token={convertToCollateralToken(loan)}
				/>
			);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	// Handle spending borrowed assets
	const handleSpend = useCallback(
		(loan: LoanPosition) => {
			setDrawerContent(
				<BorrowSpendForm initialMarket={convertToHstkToken(loan)} />
			);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	// Handle repaying debt
	const handleRepay = useCallback(
		(loan: LoanPosition) => {
			setDrawerContent(<BorrowRepayForm marketLoan={loan} />);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>My Debt Positions</Text.Medium20>
				<MyDebtQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead className='w-1/4'>Borrow Market</TableHead>
						<TableHead className='w-1/6'>Value</TableHead>
						<TableHead className='w-[150px]'></TableHead>
						<TableHead className='w-1/6'>APR</TableHead>
						<TableHead className='w-1/6'>Collateral</TableHead>
						<TableHead className='w-1/6'>Health</TableHead>
						<TableHead className='w-[80px]'></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<If isTrue={isLoadingBorrowMarket}>
						<TableLoader
							rowCount={3}
							colCount={6}
						/>
					</If>

					{!isLoadingBorrowMarket && activeLoans.length === 0 && (
						<TableNoData
							message='No debt positions found'
							colSpan={6}
						/>
					)}

					{!isLoadingBorrowMarket &&
						activeLoans.map((loan) => {
							// Calculate the borrowed value in USD
							const currentAmount =
								loan.borrowedValue.formatBalance(
									DECIMALS.PRICE
								);

							// Format the values for display
							const formattedAmount =
								loan.borrowedValue.formatBalance(
									DECIMALS.PRICE
								);

							const formattedApr =
								loan.rateInfo.borrowRate.formatToString(
									DECIMALS.APR
								) + '%';

							// Get the health factor from the loan position
							const healthFactor =
								loan.positionHealth.healthFactor.formatToString(
									DECIMALS.HEALTH_FACTOR
								);

							return (
								<TableRow
									key={`${loan.borrowedAsset.address_}-${loan.usageDetails.status}`}>
									<TableCell className='font-medium'>
										<div className='flex items-center gap-3'>
											<ImageWithLoader
												src={
													loan.borrowedAsset
														.logoURI || ''
												}
												alt={
													loan.borrowedAsset.name ||
													''
												}
												width={20}
												height={20}
												className='rounded-full'
											/>
											{loan.borrowedAsset.name}
										</div>
									</TableCell>
									<TableCell>
										<HoverBorrowValueCard
											borrowAmount={formattedAmount}
											tokenName={
												loan.borrowedAsset.name || ''
											}
											dTokenName={
												'd' +
												(loan.borrowedAsset.name || '')
											}
											dTokenIssued={formattedAmount}
											pricePerToken={loan.assetPrice.formatBalance(
												DECIMALS.PRICE
											)}
											tokenPrice={loan.assetPrice.formatBalance(
												DECIMALS.PRICE
											)}
											dappFees={FEES.DAPP_FEE.toFixed(2)}>
											<span>${currentAmount}</span>
										</HoverBorrowValueCard>
									</TableCell>
									<TableCell>
										<div className='flex gap-2 items-center'>
											<Btn.Outline
												onClick={() =>
													handleRepay(loan)
												}>
												Repay
											</Btn.Outline>
											<Btn.Secondary
												onClick={() =>
													handleSpend(loan)
												}>
												Spend
											</Btn.Secondary>
										</div>
									</TableCell>
									<TableCell>
										<HoverBorrowAprCard
											netApr={parseFloat(formattedApr)}
											changeInAprPercentage={0}
											collateralApr={0}
											borrowApr={parseFloat(
												formattedApr
											)}>
											<span>{formattedApr}</span>
										</HoverBorrowAprCard>
									</TableCell>
									<TableCell>
										{loan.collateralAsset.symbol}
									</TableCell>
									<TableCell>
										<HoverBorrowHealthCard
											healthScore={healthFactor}
											actualDebt={parseFloat(
												formattedAmount
											)}
											collateral={
												Number(
													loan.positionHealth
														.totalCollateralValue
												) /
												10 **
													loan.collateralAsset
														.decimals
											}
											netAssetValue={
												parseFloat(formattedAmount) *
												0.5
											} // Placeholder
											liquidationPrice={
												(Number(loan.assetPrice) *
													0.8) /
												10 **
													loan.borrowedAsset.decimals
											} // Approximate
											debtAssetName={
												loan.borrowedAsset.symbol || ''
											}
											collateralAssetName={
												loan.collateralAsset.symbol ||
												''
											}
											currentDebt={{
												dappName: 'HashStack',
												spendCategory:
													SpendCategory.Supply,
												value: parseFloat(
													formattedAmount
												),
												assetName:
													loan.borrowedAsset.symbol ||
													'',
											}}>
											<span>{healthFactor}</span>
										</HoverBorrowHealthCard>
									</TableCell>
									<TableCell>
										<Btn.Secondary
											onClick={() =>
												handleAddCollateral(loan)
											}>
											Add Collateral
										</Btn.Secondary>
									</TableCell>
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</div>
	);
}

export default MyDebtTable;
