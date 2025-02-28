import If from '@/components/common/If';
import { Badge } from '@/components/ui/badge';
import { Btn } from '@/components/ui/button';
import PrimaryCard from '@/components/ui/card/primary-card';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import { HstkToken } from '@/types/web3/token.types';
import { currencyFormat } from '@/utils';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import React, { useMemo } from 'react';
import { useEarnDrawer } from '@/features/earn/context/earn-drawer.context';
import SupplyForm from '../form/suppy-form';

interface EarnSupplyCardProps {
	token: HstkToken;
	price?: string;
	liquidity?: string;
	netApy?: string;
	walletBalance?: string;
	supply?: string;
	priceChangePercentage?: number;
}

interface CardDataItem {
	title: string;
	value: string | null;
	change?: number;
	rawValue: string | null;
}

function EarnSupplyCard({
	token,
	price,
	liquidity,
	netApy,
	walletBalance,
	supply,
	priceChangePercentage,
}: EarnSupplyCardProps) {
	const { openDrawer, setDrawerContent } = useEarnDrawer();

	// Handle opening the supply drawer
	const handleSupplyClick = () => {
		// Set the drawer content to the supply form
		setDrawerContent(<SupplyForm token={token} />);
		// Open the drawer
		openDrawer();
	};

	const cardData = useMemo<CardDataItem[]>(
		() =>
			[
				{
					title: 'Price',
					value: currencyFormat(price),
					rawValue: price,
					change: priceChangePercentage,
				},
				{
					title: 'Liquidity',
					value: liquidity,
					rawValue: liquidity,
				},
				{
					title: 'Net APY',
					value: netApy,
					rawValue: netApy,
				},
				{
					title: 'Wallet Balance',
					value: walletBalance,
					rawValue: walletBalance,
				},
				{
					title: 'Supply',
					value: supply,
					rawValue: supply,
				},
			].filter(
				(
					item
				): item is CardDataItem & { value: string; rawValue: string } =>
					item.rawValue !== null && item.rawValue !== undefined
			),
		[price, liquidity, netApy, walletBalance, supply, priceChangePercentage]
	);

	return (
		<PrimaryCard>
			<PrimaryCard.Header>
				<div className='flex items-center justify-between flex-1'>
					<div className='flex gap-3 items-center'>
						<ImageWithLoader
							src={token.iconUrl}
							alt={token.name}
							width={24}
							height={24}
							className='rounded-full'
						/>
						<Text.Semibold20>{token.name}</Text.Semibold20>
					</div>
					<If isTrue={token.isPaused || token.isNew}>
						<Badge
							variant={token.isPaused ? 'secondary' : 'success'}>
							{token.isPaused ? 'Paused' : 'New'}
						</Badge>
					</If>
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
