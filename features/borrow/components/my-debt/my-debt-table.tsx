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
import { MarketLoan } from '@/types/web3/borrow-market.types';
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
	const { borrowMarketData, isLoadingBorrowMarket } = useTokenStore();

	// Filter active loans (amount > 0)
	const activeLoanMarkets = useMemo(() => {
		if (!borrowMarketData) return [];
		// Filter loans with non-zero amounts
		const loanMarket = borrowMarketData.filter(
			({ userLoan }) => userLoan.loanId !== BigInt(0)
		);

		// Map the loans to their corresponding market data
		return loanMarket;
	}, [borrowMarketData]);

	// Convert MarketLoan to HstkToken for form components
	const convertToHstkToken = (market: MarketLoan): HstkToken => ({
		name: market.asset.name,
		symbol: market.asset.symbol,
		address: market.asset.address_,
		decimals: market.asset.decimals,
		iconUrl: market.asset.logoURI,
		isNew: false,
		isPaused: false,
	});

	// Convert MarketLoan to CollateralToken for form components
	const convertToCollateralToken = (market: MarketLoan): CollateralToken => ({
		name: market.asset.name,
		symbol: market.asset.symbol,
		address: market.asset.address_,
		decimals: market.asset.decimals,
		iconUrl: market.asset.logoURI,
		availableCollateral: 100, // Placeholder value
	});

	// Handle adding collateral
	const handleAddCollateral = useCallback(
		(market: MarketLoan) => {
			setDrawerContent(
				<BorrowAddCollateralForm
					token={convertToCollateralToken(market)}
				/>
			);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	// Handle spending borrowed assets
	const handleSpend = useCallback(
		(market: MarketLoan) => {
			setDrawerContent(
				<BorrowSpendForm initialMarket={convertToHstkToken(market)} />
			);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	// Handle repaying debt
	const handleRepay = useCallback(
		(market: MarketLoan) => {
			setDrawerContent(<BorrowRepayForm marketLoan={market} />);
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

					{!isLoadingBorrowMarket &&
						activeLoanMarkets.length === 0 && (
							<TableNoData
								message='No debt positions found'
								colSpan={6}
							/>
						)}

					{!isLoadingBorrowMarket &&
						activeLoanMarkets.map((market) => {
							// Calculate the borrowed value in USD
							const { userLoan } = market;

							const currentAmount =
								userLoan.currentAmount.formatBalance(
									DECIMALS.BORROW_MARKET
								);

							// Format the values for display
							const formattedAmount =
								userLoan.amount.formatBalance(
									DECIMALS.BORROW_MARKET
								);

							const formattedApr =
								market.borrowApr.formatToString(DECIMALS.APR) +
								'%';

							// Health factor calculation (placeholder - replace with actual calculation)
							const healthFactor = 3.34; // This should be calculated based on collateral value vs debt

							return (
								<TableRow
									key={`${userLoan.loanId}-${market.address_}`}>
									<TableCell className='font-medium'>
										<div className='flex items-center gap-3'>
											<ImageWithLoader
												src={
													market?.asset.logoURI || ''
												}
												alt={market?.asset.name || ''}
												width={20}
												height={20}
												className='rounded-full'
											/>
											{market?.asset.name}
										</div>
									</TableCell>
									<TableCell>
										<HoverBorrowValueCard
											borrowAmount={formattedAmount}
											tokenName={market?.asset.name || ''}
											dTokenName={
												'd' + (market?.asset.name || '')
											}
											dTokenIssued={formattedAmount}
											pricePerToken={market.asset.priceUSD.formatBalance(
												market.asset.decimals
											)}
											tokenPrice={market.asset.priceUSD.formatBalance(
												market.asset.decimals
											)}
											dappFees={FEES.DAPP_FEE.toFixed(2)}>
											<span>${currentAmount}</span>
										</HoverBorrowValueCard>
									</TableCell>
									<TableCell>
										<div className='flex gap-2 items-center'>
											<Btn.Outline
												onClick={() =>
													market &&
													handleRepay(market)
												}>
												Repay
											</Btn.Outline>
											<Btn.Secondary
												onClick={() =>
													market &&
													handleSpend(market)
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
										{market?.asset.symbol}
									</TableCell>
									<TableCell>
										<HoverBorrowHealthCard
											healthScore={healthFactor}
											actualDebt={parseFloat(
												formattedAmount
											)}
											collateral={
												parseFloat(formattedAmount) *
												1.5
											} // Placeholder
											netAssetValue={
												parseFloat(formattedAmount) *
												0.5
											} // Placeholder
											liquidationPrice={
												Number(
													market?.asset.priceUSD || 0
												) * 0.8
											} // Placeholder
											debtAssetName={
												market?.asset.symbol || ''
											}
											collateralAssetName={
												market?.asset.symbol || ''
											}
											currentDebt={{
												dappName: 'HashStack',
												spendCategory:
													SpendCategory.Supply,
												value: parseFloat(
													formattedAmount
												),
												assetName:
													market?.asset.symbol || '',
											}}>
											<span>
												{healthFactor.toFixed(2)}
											</span>
										</HoverBorrowHealthCard>
									</TableCell>
									<TableCell>
										<Btn.Secondary
											onClick={() =>
												market &&
												handleAddCollateral(market)
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
