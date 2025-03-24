'use client';
import React, { useCallback } from 'react';
import MyPositionQuickStat from '../common/my-position-quick-stat';
import MyPositionCard from './my-position-card';
import { useEarnDrawer } from '../../context/earn-drawer.context';
import SupplyForm from '../form/supply-form';
import { useTokenStore } from '@/store/useTokenStore';
import { SupplyPosition } from '@/types/web3/supply-market.types';
import '@prototype/bigint.prototype';
import If from '@/components/common/If';
import { Text } from '@/components/ui/typography/Text';
import { Skeleton } from '@/components/ui/skeleton/skeleton';

function MyPositionCardStack() {
	const { openDrawer, setDrawerContent } = useEarnDrawer();
	const { userSupplyPositions, supplyMarketData, isLoadingSupplyMarket } =
		useTokenStore();

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
		[setDrawerContent, openDrawer, supplyMarketData]
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
				// setDrawerContent(<SupplyWithdrawForm market={market} position={position} />);
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
			<If isTrue={isLoadingSupplyMarket}>
				<div className='flex flex-col gap-4'>
					{[...Array(3)].map((_, index) => (
						<Skeleton
							className='h-48 w-full'
							key={`shimmer-${index}`}
						/>
					))}
				</div>
			</If>
			{!isLoadingSupplyMarket && userSupplyPositions.length === 0 && (
				<div className='text-center py-4'>No positions found</div>
			)}
			{!isLoadingSupplyMarket && userSupplyPositions.length > 0 && (
				<>
					{userSupplyPositions.map((position) => {
						// Convert the SupplyPosition to the format expected by MyPositionCard
						const token = {
							address: position.supplyAsset.address_,
							name: position.supplyAsset.name,
							symbol: position.supplyAsset.symbol,
							decimals: position.supplyAsset.decimals,
							iconUrl: position.underlyingAsset.logoURI,
						};

						return (
							<MyPositionCard
								key={position.supplyAsset.address_}
								token={token}
								value={position.marketValue.formatBalance(
									position.supplyAsset.decimals
								)}
								APR={position.effectiveYield.formatToString(
									position.supplyAsset.decimals
								)}
								onAddClick={() =>
									handleOpenSupplyForm(position)
								}
								onWithdrawClick={() =>
									handleOpenWithdrawForm(position)
								}
							/>
						);
					})}
				</>
			)}
		</div>
	);
}

export default MyPositionCardStack;
