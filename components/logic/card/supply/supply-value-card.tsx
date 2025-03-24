import ImageCard from '@/components/ui/card/image-card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { SupplyPosition } from '@/types/web3/supply-market.types';

import React, { useMemo } from 'react';

export interface SupplyValueCardProps {
	supplyData: SupplyPosition;
}

type DataItem = { label: string; value: string };

function SupplyValueCard({ supplyData }: SupplyValueCardProps) {
	const data = useMemo(() => {
		const suppliedAmount = Number(
			supplyData.suppliedAmount.formatBalance(
				supplyData.supplyAsset.decimals
			)
		);
		const receiptTokens = Number(
			supplyData.receiptTokens.formatBalance(
				supplyData.supplyAsset.decimals
			)
		);
		const supplyAssetPrice = Number(
			supplyData.supplyAsset.priceUSD.formatBalance(
				supplyData.supplyAsset.decimals
			)
		);
		const underlyingAssetPrice = Number(
			supplyData.underlyingAsset.priceUSD.formatBalance(
				supplyData.underlyingAsset.decimals
			)
		);

		const items: Array<[string, number | undefined, string | undefined]> = [
			['Deposit amount', suppliedAmount, `$${suppliedAmount.toFixed(3)}`],
			[
				`${supplyData.supplyAsset.symbol} issued`,
				receiptTokens,
				receiptTokens.toFixed(3),
			],
			[
				`1 ${supplyData.supplyAsset.symbol}`,
				supplyAssetPrice,
				`$${supplyAssetPrice.toFixed(3)}`,
			],
			[
				`1 ${supplyData.underlyingAsset.symbol}`,
				underlyingAssetPrice,
				`$${underlyingAssetPrice.toFixed(3)}`,
			],
		];

		return items
			.filter(
				(item): item is [string, number, string] =>
					item[1] !== undefined
			)
			.map(
				([label, , value]): DataItem => ({
					label,
					value,
				})
			);
	}, [supplyData]);

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-start justify-between gap-2'>
				<div className='flex flex-col gap-1'>
					<Text.Regular12 textColor={500}>Value</Text.Regular12>
					<Text.Semibold14>{`${Number(supplyData.marketValue.formatBalance(supplyData.supplyAsset.decimals)).toFixed(3)}`}</Text.Semibold14>
				</div>
				<ImageCard
					imageUrl={supplyData.underlyingAsset.logoURI}
					boxSize={32}
					imageSize={20}
				/>
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

export default SupplyValueCard;
