'use client';
import React, { useCallback } from 'react';
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
import BorrowQuickStat from '../common/borrow-quick-stat';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import { Text } from '@/components/ui/typography/Text';
import If from '@/components/common/If';
import BorrowForm from '../form/borrow-form';
import { useTokenStore } from '@/store/useTokenStore';
import AddTokenToWallet from '@/components/actions/cta/add-token-to-wallet';
import '@prototype/bigint.prototype';
import { MarketLoan } from './borrow-market.types';

/**
 * BorrowTable component
 * Displays a table of available borrow markets and allows users to borrow assets
 */
function BorrowTable() {
	const { openDrawer, setDrawerContent } = useBorrowDrawer();
	const { borrowMarketData, isLoadingBorrowMarket } = useTokenStore();

	// Handle opening the borrow drawer
	const handleBorrow = useCallback(
		(token: MarketLoan) => {
			setDrawerContent(<BorrowForm borrowMarket={token} />);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Borrow Markets</Text.Medium20>
				<BorrowQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead className='w-1/3'>Borrow Market</TableHead>
						<TableHead className='w-1/4'>Price</TableHead>
						<TableHead className='w-1/4'>
							Utilization Rate
						</TableHead>
						<TableHead className='w-1/4'>Borrow APR</TableHead>
						<TableHead className='w-[100px]'></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<If isTrue={isLoadingBorrowMarket}>
						<TableLoader
							rowCount={4}
							colCount={6}
						/>
						<If isTrue={borrowMarketData.length === 0}>
							<TableNoData
								message='No borrow markets available'
								colSpan={6}
							/>
							<>
								{borrowMarketData.map((market) => (
									<TableRow key={market.address_}>
										<TableCell className='font-medium'>
											<div className='flex items-center gap-3'>
												<ImageWithLoader
													src={market.asset.logoURI}
													alt={market.asset.name}
													width={20}
													height={20}
													className='rounded-full'
												/>
												{market.asset.name}
												<AddTokenToWallet
													className='bg-background w-6 h-6 rounded-full'
													address={market.address_}
													symbol={market.asset.symbol}
													decimals={
														market.asset.decimals
													}
													name={market.asset.name}
													iconUrl={
														market.asset.logoURI
													}
												/>
											</div>
										</TableCell>
										<TableCell>
											$
											{market.asset.priceUSD.formatBalance(
												market.asset.decimals
											)}
										</TableCell>
										<TableCell>
											{market.utilizationRate.formatToString(
												10
											)}
											%
										</TableCell>
										<TableCell>
											{market.borrowApr.formatToString(
												10
											)}
											%
										</TableCell>
										<TableCell>
											<Btn.Secondary
												onClick={() =>
													handleBorrow(market)
												}>
												Borrow
											</Btn.Secondary>
										</TableCell>
									</TableRow>
								))}
							</>
						</If>
					</If>
				</TableBody>
			</Table>
		</div>
	);
}

export default BorrowTable;
