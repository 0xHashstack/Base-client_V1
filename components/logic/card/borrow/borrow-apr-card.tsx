/* eslint-disable @typescript-eslint/no-unused-vars */
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import '@prototype/bigint.prototype';
import React, { useMemo } from 'react';

export interface BorrowAprCardProps {
	borrowApr?: bigint;
	collateralApr?: bigint;
	netApr: bigint;
	changeInAprPercentage?: bigint;
}

type DataItem = { label: string; value: string };

function BorrowAprCard({
	borrowApr,
	collateralApr,
	netApr,
	changeInAprPercentage,
}: BorrowAprCardProps) {
	const data = useMemo(() => {
		const items: Array<[string, bigint | undefined, string | undefined]> = [
			[
				'Borrow APR',
				borrowApr,
				`${borrowApr?.formatToString(DECIMALS.APR)}%`,
			],
			[
				'Collateral APR',
				collateralApr,
				`${collateralApr?.formatToString(DECIMALS.APR)}%`,
			],
			['Net APR', netApr, `${netApr?.formatToString(DECIMALS.APR)}%`],
		];

		return items
			.filter(
				(
					item
				): item is [string, bigint | undefined, string | undefined] =>
					item[1] !== undefined
			)
			.map(
				([label, _, value]): DataItem => ({
					label,
					value: value || '',
				})
			);
	}, [borrowApr, collateralApr, netApr]);

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between gap-2'>
				<div className='flex flex-col gap-1'>
					<Text.Regular12 textColor={600}>Net APR</Text.Regular12>
					<Text.Semibold14>
						{netApr.formatToString(DECIMALS.APR)}%
					</Text.Semibold14>
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
							{Math.abs(
								changeInAprPercentage.format(DECIMALS.APR)
							)}
							%
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
