import { Btn } from '@/components/ui/button';
import PrimaryCard from '@/components/ui/card/primary-card';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import { HstkToken } from '@/types/web3/token.types';
import { currencyFormat } from '@/utils';
import { FallbackImage } from '@/components/ui/image/fallback-image';
import React, { useMemo } from 'react';

interface MyPositionCardProps {
	token: HstkToken;
	value?: string | null;
	APR?: string | null;
}

interface CardDataItem {
	title: string;
	value: string | null;
	change?: number;
	rawValue: string | null;
}

function MyPositionCard({ token, value, APR }: MyPositionCardProps) {
	const cardData = useMemo<CardDataItem[]>(
		() =>
			[
				{
					title: 'Value',
					value: currencyFormat(value),
					rawValue: value,
				},
				{
					title: 'APR',
					value: APR,
					rawValue: APR,
				},
			].filter(
				(
					item
				): item is CardDataItem & { value: string; rawValue: string } =>
					item.rawValue !== null && item.rawValue !== undefined
			),
		[value, APR]
	);

	return (
		<PrimaryCard>
			<PrimaryCard.Header>
				<div className='flex items-center justify-between flex-1'>
					<div className='flex gap-3 items-center'>
						<FallbackImage
							src={token.iconUrl}
							alt={token.name}
							width={24}
							height={24}
							className='rounded-full'
						/>
						<Text.Semibold20>{token.name}</Text.Semibold20>
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
				<div className='flex items-center gap-3'>
					<Btn.Outline className='flex-1'>Add</Btn.Outline>
					<Btn.Secondary className='flex-1'>Withdraw</Btn.Secondary>
				</div>
			</PrimaryCard.Body>
		</PrimaryCard>
	);
}

export default MyPositionCard;
