/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useCallback } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableNoData,
	TableLoader,
} from '@/components/ui/table/index';
import { Btn } from '@/components/ui/button';
import { Text } from '@/components/ui/typography/Text';
import { useEarnDrawer } from '../../context/earn-drawer.context';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import MyPositionQuickStat from '../common/my-position-quick-stat';
import SupplyWithdrawForm from '../form/supply-withdraw-form';
import SupplyForm from '../form/supply-form';
import { useTokenStore } from '@/store/useTokenStore';
import { SupplyPosition } from '@/types/web3/supply-market.types';
import '@prototype/bigint.prototype';
import If from '@/components/common/If';
import AddTokenToWallet from '@/components/actions/cta/add-token-to-wallet';
import { HoverSupplyValueCard } from '../card/hover-cards';

function MyPositionsTable() {
	const { openDrawer, setDrawerContent } = useEarnDrawer();
	const userSupplyPositions = useTokenStore(
		(state) => state.userSupplyPositions
	);
	const supplyMarketData = useTokenStore((state) => state.supplyMarketData);
	const isLoadingSupplyMarket = useTokenStore(
		(state) => state.isLoadingSupplyMarket
	);

	/**
	 * Handle opening the supply form
	 * Finds the corresponding market from supplyMarketData and passes it to the form
	 */
	const handleOpenSupplyForm = useCallback(
		(position: SupplyPosition) => {
			// Find the market that corresponds to this position's underlying asset
			const market = supplyMarketData.find(
				(m) => m.asset.address_ === position.underlyingAsset.address_
			);

			if (market) {
				setDrawerContent(<SupplyForm market={market} />);
				openDrawer();
			}
		},
		[openDrawer, supplyMarketData]
	);

	/**
	 * Handle opening the withdraw form
	 */
	const handleOpenWithdrawForm = useCallback(
		(position: SupplyPosition) => {
			// Find the market that corresponds to this position's underlying asset
			const market = supplyMarketData.find(
				(m) => m.asset.address_ === position.underlyingAsset.address_
			);

			if (market) {
				// For now, we'll just pass the market to the withdraw form
				// You might need to adjust this based on what the SupplyWithdrawForm expects
				setDrawerContent(<SupplyWithdrawForm position={position} />);
				openDrawer();
			}
		},
		[openDrawer, supplyMarketData]
	);

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>My Positions</Text.Medium20>
				<MyPositionQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead className='w-1/3'>Market</TableHead>
						<TableHead className='w-1/3'>Value</TableHead>
						<TableHead className='w-1/3'>APR</TableHead>
						<TableHead className='w-[200px]'></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<If isTrue={isLoadingSupplyMarket}>
						<TableLoader
							rowCount={3}
							colCount={4}
						/>
						<If isTrue={userSupplyPositions.length === 0}>
							<TableNoData
								message='No positions found'
								colSpan={4}
							/>
							<>
								{userSupplyPositions.map((position) => (
									<TableRow
										key={position.supplyAsset.address_}>
										<TableCell className='font-medium'>
											<div className='flex items-center gap-3'>
												<ImageWithLoader
													src={
														position.underlyingAsset
															.logoURI
													}
													alt={
														position.supplyAsset
															.name
													}
													width={20}
													height={20}
												/>
												{position.supplyAsset.name}
												<AddTokenToWallet
													className='bg-background w-6 h-6 rounded-full'
													address={
														position.supplyAsset
															.address_
													}
													symbol={
														position.supplyAsset
															.symbol
													}
													decimals={
														position.supplyAsset
															.decimals
													}
													name={
														position.supplyAsset
															.name
													}
													iconUrl={
														position.underlyingAsset
															.logoURI
													}
												/>
											</div>
										</TableCell>
										<TableCell>
											<HoverSupplyValueCard
												supplyData={position}>
												<span>
													$
													{position.marketValue.formatBalance(
														position.supplyAsset
															.decimals
													)}
												</span>
											</HoverSupplyValueCard>
										</TableCell>
										<TableCell>
											{position.effectiveYield.formatToString(
												position.supplyAsset.decimals
											)}
											%
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-4'>
												<Btn.Outline
													onClick={() =>
														handleOpenWithdrawForm(
															position
														)
													}>
													Withdraw
												</Btn.Outline>
												<Btn.Secondary
													onClick={() =>
														handleOpenSupplyForm(
															position
														)
													}>
													Add
												</Btn.Secondary>
											</div>
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

export default MyPositionsTable;
