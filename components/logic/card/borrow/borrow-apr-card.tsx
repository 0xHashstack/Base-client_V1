/* eslint-disable @typescript-eslint/no-unused-vars */
import IconCard from '@/components/ui/card/icon-card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';

import React, { useMemo } from 'react';

export interface BorrowAprCardProps {
	borrowApr?: number;
	collateralApr?: number;
	netApr: number;
	changeInAprPercentage?: number;
}

type DataItem = { label: string; value: string };

function BorrowAprCard({
	borrowApr,
	collateralApr,
	netApr,
	changeInAprPercentage,
}: BorrowAprCardProps) {
	const data = useMemo(() => {
		const items: Array<[string, number | undefined, string | undefined]> = [
			['Borrow APR', borrowApr, `${borrowApr?.toFixed(2)}%`],
			['Collateral APR', collateralApr, `${collateralApr?.toFixed(2)}%`],
			['Net APR', netApr, `${netApr?.toFixed(2)}%`],
		];

		return items
			.filter(
				(item): item is [string, number, string] =>
					item[1] !== undefined
			)
			.map(
				([label, _, value]): DataItem => ({
					label,
					value,
				})
			);
	}, [borrowApr, collateralApr, netApr]);

	return (
		<div className='flex flex-col gap-4 bg-card'>
			<div className='flex items-center justify-between gap-2'>
				<div className='flex flex-col gap-1'>
					<Text.Regular12 textColor={500}>Net APR</Text.Regular12>
					<Text.Semibold14>{netApr.toFixed(2)}%</Text.Semibold14>
				</div>
				{changeInAprPercentage && (
					<div className='flex items-center gap-0.5'>
						{changeInAprPercentage < 0 ?
							<ArrowDown
								className='text-red-500'
								size={14}
							/>
						:	<ArrowUp
								className='text-green-500'
								size={14}
							/>
						}
						<Text.Semibold12
							className={
								changeInAprPercentage < 0 ? 'text-red-500' : (
									'text-green-500'
								)
							}>
							{Math.abs(changeInAprPercentage)}%
						</Text.Semibold12>
					</div>
				)}
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

export default BorrowAprCard;
