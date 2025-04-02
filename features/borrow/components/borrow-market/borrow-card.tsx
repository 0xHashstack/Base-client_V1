import { Btn } from '@/components/ui/button';
import PrimaryCard from '@/components/ui/card/primary-card';
import { Text } from '@/components/ui/typography/Text';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import React, { useMemo } from 'react';
import { MarketLoan } from '@/types/web3/borrow-market.types';
import { DECIMALS } from '@/constant/web3/decimal.constant';

interface BorrowCardProps {
	market: MarketLoan;
	onBorrowClick?: () => void;
}

function BorrowCard({ market, onBorrowClick }: BorrowCardProps) {
	// Format values from the market object
	const formattedPrice =
		'$' + market.asset.priceUSD.formatBalance(DECIMALS.PRICE);
	const formattedLiquidity =
		'$' + market.availableToBorrow.formatBalance(DECIMALS.BORROW_MARKET);
	const formattedNetApy = market.borrowApr.formatToString(10) + '%';
	const formattedUtilizationRate =
		market.utilizationRate.formatToString(10) + '%';

	const cardData = useMemo<
		{
			title: string;
			value: string | null;
			change?: number;
			rawValue: string | null;
		}[]
	>(
		() => [
			{
				title: 'Price',
				value: formattedPrice,
				rawValue: formattedPrice,
			},
			{
				title: 'Liquidity',
				value: formattedLiquidity,
				rawValue: formattedLiquidity,
			},
			{
				title: 'Utilization Rate',
				value: formattedUtilizationRate,
				rawValue: formattedUtilizationRate,
			},
			{
				title: 'Borrow APR',
				value: formattedNetApy,
				rawValue: formattedNetApy,
			},
		],
		[
			formattedPrice,
			formattedLiquidity,
			formattedNetApy,
			formattedUtilizationRate,
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
							</div>

							<Text.Regular14>{item.value}</Text.Regular14>
						</div>
					))}
				</div>
				<Btn.Primary onClick={onBorrowClick}>Borrow</Btn.Primary>
			</PrimaryCard.Body>
		</PrimaryCard>
	);
}

export default BorrowCard;
