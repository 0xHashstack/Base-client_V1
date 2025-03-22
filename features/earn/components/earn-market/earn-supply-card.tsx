import { Btn } from '@/components/ui/button';
import PrimaryCard from '@/components/ui/card/primary-card';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import React, { useMemo } from 'react';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';
import SupplyForm from '../form/supply-form';
import { SupplyMarketData } from '@/types/web3/supply-market.types';
import '@prototype/bigint.prototype';

interface EarnSupplyCardProps {
	market: SupplyMarketData;
	priceChangePercentage?: number;
	onSupplyClick?: () => void;
}

interface CardDataItem {
	title: string;
	value: string | null;
	change?: number;
	rawValue: string | null;
}

function EarnSupplyCard({
	market,
	priceChangePercentage,
	onSupplyClick,
}: EarnSupplyCardProps) {
	const { openDrawer, setDrawerContent } = useEarnDrawer();

	// Handle opening the supply drawer
	const handleSupplyClick = () => {
		if (onSupplyClick) {
			// Use the provided handler if available
			onSupplyClick();
		} else {
			// Set the drawer content to the supply form with the market data
			setDrawerContent(<SupplyForm market={market} />);
			// Open the drawer
			openDrawer();
		}
	};

	// Format the data from the market object
	const formattedPrice =
		'$' + market.asset.priceUSD.formatBalance(market.asset.decimals);
	const formattedLiquidity = market.state.totalSupply.formatBalance(
		market.asset.decimals
	);
	const formattedNetApy =
		market.state.annualApy.formatToString(market.asset.decimals) + '%';
	const formattedWalletBalance =
		market.walletBalance.formatBalance(market.asset.decimals) +
		' ' +
		market.asset.symbol;

	const cardData = useMemo<CardDataItem[]>(
		() =>
			[
				{
					title: 'Price',
					value: formattedPrice,
					rawValue: formattedPrice,
					change: priceChangePercentage,
				},
				{
					title: 'Liquidity',
					value: formattedLiquidity,
					rawValue: formattedLiquidity,
				},
				{
					title: 'Net APY',
					value: formattedNetApy,
					rawValue: formattedNetApy,
				},
				{
					title: 'Wallet Balance',
					value: formattedWalletBalance,
					rawValue: formattedWalletBalance,
				},
			].filter(
				(
					item
				): item is CardDataItem & { value: string; rawValue: string } =>
					item.rawValue !== null && item.rawValue !== undefined
			),
		[
			formattedPrice,
			formattedLiquidity,
			formattedNetApy,
			formattedWalletBalance,
			priceChangePercentage,
		]
	);

	return (
		<PrimaryCard>
			<PrimaryCard.Header>
				<div className='flex items-center justify-between flex-1'>
					<div className='flex gap-3 items-center'>
						<ImageWithLoader
							src={market.asset.logoURI}
							alt={market.asset.name}
							width={24}
							height={24}
							className='rounded-full'
						/>
						<Text.Semibold20>{market.asset.name}</Text.Semibold20>
					</div>
					{/* Badge can be added here if needed based on market data */}
				</div>
			</PrimaryCard.Header>
			<PrimaryCard.Body>
				<div className='flex flex-col gap-5'>
					{cardData.map((item) => (
						<div
							key={item.title}
							className='flex items-center justify-between gap-1'>
							<div className='flex items-center gap-2'>
								<Text.Regular14 className='text-muted-foreground'>
									{item.title}
								</Text.Regular14>
								{item.change !== undefined && (
									<Text.Regular14
										className={cn(
											item.change > 0 ?
												'text-green-500'
											:	'text-red-500'
										)}>
										{item.change > 0 ? '↑' : '↓'}{' '}
										{Math.abs(item.change)}%
									</Text.Regular14>
								)}
							</div>

							<Text.Regular14>{item.value}</Text.Regular14>
						</div>
					))}
				</div>
				<Btn.Primary onClick={handleSupplyClick}>Supply</Btn.Primary>
			</PrimaryCard.Body>
		</PrimaryCard>
	);
}

export default EarnSupplyCard;
