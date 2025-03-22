'use client';
import React from 'react';
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
import EarnQuickStat from '../common/earn-quick-stat';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import AddTokenToWallet from '@/components/actions/cta/add-token-to-wallet';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';
import { useTokenStore } from '@/store/useTokenStore';
import { SupplyMarketData } from '@/types/web3/supply-market.types';
import '@prototype/bigint.prototype';
import If from '@/components/common/If';
import SupplyForm from '../form/supply-form';

function EarnTable() {
	const { openDrawer, setDrawerContent } = useEarnDrawer();
	const { supplyMarketData, isLoadingSupplyMarket } = useTokenStore();

	// Handle opening the supply drawer
	const handleSupplyClick = (market: SupplyMarketData) => {
		setDrawerContent(<SupplyForm market={market} />);
		// Open the drawer
		openDrawer();
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Earn Markets</Text.Medium20>
				<EarnQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead>Market</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Liquidity</TableHead>
						<TableHead>Net APR</TableHead>
						<TableHead>Wallet balance</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<If isTrue={isLoadingSupplyMarket}>
						<TableLoader
							rowCount={4}
							colCount={6}
						/>
						<If isTrue={supplyMarketData.length === 0}>
							<TableNoData
								message='No markets available'
								colSpan={6}
							/>
							<>
								{supplyMarketData.map((market) => {
									return (
										<TableRow key={market.asset.address_}>
											<TableCell className='font-medium'>
												<div className='flex items-center gap-3'>
													<ImageWithLoader
														src={
															market.asset.logoURI
														}
														alt={market.asset.name}
														width={20}
														height={20}
													/>
													{market.asset.name}
													<AddTokenToWallet
														className='bg-background w-6 h-6 rounded-full'
														address={
															market.asset
																.address_
														}
														symbol={
															market.asset.symbol
														}
														decimals={
															market.asset
																.decimals
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
												{market.state.totalSupply.formatBalance(
													market.asset.decimals
												)}
											</TableCell>
											<TableCell>
												{market.state.annualApy.formatToString(
													market.asset.decimals
												)}
												%
											</TableCell>

											<TableCell>
												<span>
													{market.walletBalance.formatBalance(
														market.asset.decimals
													)}{' '}
													{market.asset.symbol}
												</span>
											</TableCell>

											<TableCell className='w-20'>
												<Btn.Secondary
													onClick={() =>
														handleSupplyClick(
															market
														)
													}>
													Supply
												</Btn.Secondary>
											</TableCell>
										</TableRow>
									);
								})}
							</>
						</If>
					</If>
				</TableBody>
			</Table>
			{/* The SideDrawer is now managed by the EarnDrawerProvider */}
		</div>
	);
}

export default EarnTable;
