/* eslint-disable @typescript-eslint/no-unused-vars */
import IconCard from '@/components/ui/card/icon-card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { SealCheck } from '@phosphor-icons/react';

import React, { useMemo } from 'react';

export interface BorrowValueCardProps {
	borrowAmount: string;
	tokenName: string;
	dTokenName: string;
	dTokenIssued?: string;
	pricePerToken?: string;
	tokenPrice?: string;
	dappFees?: string;
}

type DataItem = { label: string; value: string };

function BorrowValueCard({
	borrowAmount,
	tokenName,
	dTokenName,
	dTokenIssued,
	pricePerToken,
	tokenPrice,
	dappFees,
}: BorrowValueCardProps) {
	const data = useMemo(() => {
		const items: Array<[string, string | undefined, string | undefined]> = [
			[`${dTokenName} issued`, dTokenIssued, dTokenIssued],
			[`1 ${tokenName}`, tokenPrice, `$${tokenPrice}`],
			[`Price per ${tokenName}`, pricePerToken, `$${pricePerToken}`],
			['Dapp fee', dappFees, `$${dappFees}`],
		];

		return items
			.filter(
				(item): item is [string, string, string] =>
					item[1] !== undefined
			)
			.map(
				([label, _, value]): DataItem => ({
					label,
					value,
				})
			);
	}, [
		tokenName,
		dTokenName,
		dTokenIssued,
		pricePerToken,
		tokenPrice,
		dappFees,
	]);

	return (
		<div className='flex flex-col gap-4 overflow-hidden'>
			<div className='flex items-start justify-between gap-2'>
				<div className='flex flex-col gap-1'>
					<Text.Regular12 textColor={500}>
						Borrow Amount
					</Text.Regular12>
					<Text.Semibold14>{borrowAmount}</Text.Semibold14>
				</div>
				<IconCard icon={SealCheck} />
			</div>
			<Separator />
			<div className='flex flex-col gap-3.5'>
				{data.map((item, index) => (
					<div
						key={index}
						className='flex items-center justify-between gap-1'>
						<Text.Medium12 textColor={600}>
							{item.label}
						</Text.Medium12>
						<Text.Medium12>{item.value}</Text.Medium12>
					</div>
				))}
			</div>
		</div>
	);
}

export default BorrowValueCard;
