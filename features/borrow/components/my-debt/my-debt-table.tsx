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
import { HstkToken } from '@/types/web3/token.types';
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

	const collateralTokens = useTokenStore(
		(state) => state.borrowMarketCollateral
	);
	// Filter active loans based on status
	const activeLoans = useMemo(() => {
		if (!userAllLoans || userAllLoans.length === 0) return [];

		// Filter loans with active status
		return userAllLoans.filter((loan) =>
			[LoanUsageStatus.ACTIVE, LoanUsageStatus.SPENT].includes(
				Number(loan.usageDetails.status)
			)
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

	// Handle adding collateral
	const handleAddCollateral = useCallback(
		(loan: LoanPosition) => {
			setDrawerContent(<BorrowAddCollateralForm loanPosition={loan} />);
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
							const borrowedAmount =
								loan.borrowedValue.formatBalance(
									DECIMALS.PRICE
								);

							// Format the values for display
							const dTokenAmount =
								loan.debtTokenAmount.formatBalance(
									loan.borrowedAsset.decimals
								);

							// Get the health factor from the loan position
							const healthFactor =
								loan.positionHealth.healthFactor.formatToString(
									DECIMALS.HEALTH_FACTOR
								);

							const {
								logoURI: collateralIconUrl = loan.borrowedAsset
									.logoURI,
							} =
								collateralTokens.find(
									({ address }) =>
										address === loan.collateralAsset.addr
								) || {};

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
											borrowAmount={borrowedAmount}
											tokenName={
												loan.borrowedAsset.symbol || ''
											}
											dTokenName={
												'd' +
												(loan.borrowedAsset.symbol ||
													'')
											}
											dTokenIssued={dTokenAmount}
											pricePerToken={loan.assetPrice.formatBalance(
												DECIMALS.PRICE
											)}
											tokenPrice={loan.assetPrice.formatBalance(
												DECIMALS.PRICE
											)}
											dappFees={FEES.DAPP_FEE.toFixed(2)}>
											<span>${borrowedAmount}</span>
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
											netApr={loan.rateInfo.effectiveRate}
											changeInAprPercentage={
												loan.rateInfo.rateChange
											}
											collateralApr={
												loan.rateInfo.collateralRate
											}
											borrowApr={
												loan.rateInfo.borrowRate
											}>
											<span>
												{loan.rateInfo.effectiveRate.formatToString(
													DECIMALS.APR
												)}
												%
											</span>
										</HoverBorrowAprCard>
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-2'>
											<ImageWithLoader
												src={collateralIconUrl}
												alt={
													loan.borrowedAsset.name ||
													''
												}
												width={20}
												height={20}
												className='rounded-full'
											/>
											{loan.collateralAsset.name}
										</div>
									</TableCell>
									<TableCell>
										<HoverBorrowHealthCard
											healthScore={healthFactor}
											actualDebt={loan.positionHealth.currentDebt.formatBalance(
												DECIMALS.BORROW_MARKET
											)}
											collateral={loan.collateralAsset.collateralAmount.formatBalance(
												loan.collateralAsset.decimals
											)}
											netAssetValue={loan.assetPrice.formatBalance(
												DECIMALS.PRICE
											)}
											liquidationPrice={loan.positionHealth.riskThreshold.formatBalance(
												DECIMALS.BORROW_MARKET
											)}
											debtAssetName={
												loan.borrowedAsset.symbol || ''
											}
											collateralAssetName={
												loan.collateralAsset.symbol ||
												''
											}
											currentDebt={{
												dappName:
													loan.usageDetails
														.applicationName,
												spendCategory:
													loan.usageDetails.status,
												value: loan.usageDetails.transactionValue.format(
													DECIMALS.PRICE
												),
												assetName:
													loan.usageDetails.tokenName,
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
