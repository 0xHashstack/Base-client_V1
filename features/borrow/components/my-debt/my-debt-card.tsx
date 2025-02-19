import { Btn } from '@/components/ui/button';
import PrimaryCard from '@/components/ui/card/primary-card';
import { Text } from '@/components/ui/typography/Text';
import { HstkToken } from '@/types/web3/token.types';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface MyDebtCardProps {
	token: HstkToken;
	amount: string;
	apy: string;
	healthFactor: string;
}

function MyDebtCard({ token, amount, apy, healthFactor }: MyDebtCardProps) {
	const cardData = useMemo<
		{
			title: string;
			value: string;
		}[]
	>(
		() => [
			{
				title: 'Debt',
				value: currencyFormat(amount),
			},
			{
				title: 'APY',
				value: `${apy}%`,
			},
			{
				title: 'Health Factor',
				value: healthFactor,
			},
		],
		[amount, apy, healthFactor]
	);

	return (
		<PrimaryCard>
			<PrimaryCard.Header>
				<div className='flex items-center gap-3'>
					<Image
						src={token.iconUrl}
						alt={token.name}
						width={24}
						height={24}
						className='rounded-full'
					/>
					<Text.Semibold20>{token.name}</Text.Semibold20>
				</div>
			</PrimaryCard.Header>
			<PrimaryCard.Body>
				<div className='flex flex-col gap-5'>
					{cardData.map((item) => (
						<div
							key={item.title}
							className='flex items-center justify-between gap-1'>
							<Text.Regular14 className='text-muted-foreground'>
								{item.title}
							</Text.Regular14>
							<Text.Regular14>{item.value}</Text.Regular14>
						</div>
					))}
				</div>
				<Btn.Primary>Repay</Btn.Primary>
			</PrimaryCard.Body>
		</PrimaryCard>
	);
}

export default MyDebtCard;
