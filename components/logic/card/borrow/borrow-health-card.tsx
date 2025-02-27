/* eslint-disable @typescript-eslint/no-unused-vars */
import If from '@/components/common/If';
import { Badge } from '@/components/ui/badge';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { CurrentDebt } from '@/types/web3/borrow.types';
import { currencyFormat } from '@/utils';
import React, { useMemo } from 'react';

export type BorrowHealthCardProps = {
	healthScore: number;
	actualDebt?: number;
	debtAssetName?: string;
	collateralAssetName?: string;
	collateral?: number;
	netAssetValue?: number;
	liquidationPrice?: number;
	currentDebt?: CurrentDebt;
};

function BorrowHealthCard({
	healthScore,
	actualDebt,
	collateral,
	netAssetValue,
	debtAssetName,
	collateralAssetName,
	liquidationPrice,
	currentDebt,
}: BorrowHealthCardProps) {
	type DataItem = { label: string; value: string };

	const data = useMemo(() => {
		const items: Array<[string, number | undefined, string | undefined]> = [
			[
				'Debt Actual',
				actualDebt,
				actualDebt ? `${actualDebt}${debtAssetName}` : undefined,
			],
			[
				'Collateral',
				collateral,
				collateral ? `${collateral}${collateralAssetName}` : undefined,
			],
			[
				'Net Asset Value',
				netAssetValue,
				netAssetValue ? `${currencyFormat(netAssetValue)}` : undefined,
			],
			[
				'Liquidation Price',
				liquidationPrice,
				liquidationPrice ?
					`${currencyFormat(liquidationPrice)}`
				:	undefined,
			],
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
	}, [actualDebt, collateral, netAssetValue, liquidationPrice]);

	return (
		<div className='flex flex-col'>
			<div className='p-4 flex items-center justify-between gap-1'>
				<div className='flex flex-col'>
					<Text.Regular10 textColor={500}>Health</Text.Regular10>
					<Text.Semibold14>{healthScore.toFixed(3)}</Text.Semibold14>
				</div>
			</div>

			<div className='p-4 flex flex-col gap-3.5 border-t rounded-xl'>
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
				<If isTrue={!!currentDebt}>
					<div className='flex flex-col gap-3'>
						<Separator />
						<Text.Semibold12>Debt Current</Text.Semibold12>
						<If isTrue={currentDebt!.dappName}>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2'>
									<If isTrue={currentDebt!.dappIcon}>
										<ImageWithLoader
											src={currentDebt!.dappIcon!}
											width={14}
											height={14}
											alt='dapp icon'
										/>
									</If>
									<Text.Regular10>
										{currentDebt!.dappName}
									</Text.Regular10>
								</div>
								<Badge
									variant='secondary'
									className='text-[10px]'>
									dapp name
								</Badge>
							</div>
						</If>
						<If isTrue={currentDebt!.spendCategory}>
							<div className='flex items-center gap-3'>
								<Text.Regular10>
									{currentDebt!.spendCategory}
								</Text.Regular10>
								<Badge
									variant='secondary'
									className='text-[10px]'>
									spend category
								</Badge>
							</div>
						</If>
						<If isTrue={currentDebt!.value}>
							<div className='flex items-center gap-3'>
								<Text.Regular10>
									{currencyFormat(currentDebt!.value)}
								</Text.Regular10>
								<Badge
									variant='secondary'
									className='text-[10px]'>
									value
								</Badge>
							</div>
						</If>
						<If isTrue={currentDebt!.assetName}>
							<div className='flex items-center gap-3'>
								<Text.Regular10>
									{currentDebt!.assetName}
								</Text.Regular10>
								<Badge
									variant='secondary'
									className='text-[10px]'>
									asset
								</Badge>
							</div>
						</If>
					</div>
				</If>
			</div>
		</div>
	);
}

export default BorrowHealthCard;
