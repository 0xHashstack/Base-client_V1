import ImageCard from '@/components/ui/card/image-card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';
import { DECIMALS } from '@/constant/web3/decimal.constant';
import { SupplyPosition } from '@/types/web3/supply-market.types';

import React, { useMemo } from 'react';

export interface SupplyValueCardProps {
	supplyData: SupplyPosition;
}

type DataItem = { label: string; value: string };

function SupplyValueCard({ supplyData }: SupplyValueCardProps) {
	console.log({ supplyData });
	const data = useMemo(() => {
		const suppliedAmount = supplyData.suppliedAmount.formatBalance(
			DECIMALS.PRICE
		);

		const receiptTokens = supplyData.receiptTokens.formatBalance(
			DECIMALS.SUPPLY_MARKET
		);

		const supplyAssetPrice = supplyData.supplyAsset.priceUSD.formatBalance(
			DECIMALS.PRICE
		);

		const underlyingAssetPrice =
			supplyData.underlyingAsset.priceUSD.formatBalance(DECIMALS.PRICE);

		const items: Array<[string, string | undefined, string | undefined]> = [
			['Deposit amount', suppliedAmount, `$${suppliedAmount}`],
			[
				`${supplyData.supplyAsset.symbol} issued`,
				receiptTokens,
				receiptTokens,
			],
			[
				`1 ${supplyData.supplyAsset.symbol}`,
				supplyAssetPrice,
				`$${supplyAssetPrice}`,
			],
			[
				`1 ${supplyData.underlyingAsset.symbol}`,
				underlyingAssetPrice,
				`$${underlyingAssetPrice}`,
			],
		];

		return items
			.filter(
				(item): item is [string, string, string] =>
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
					<Text.Semibold14>{`$${supplyData.marketValue.formatBalance(DECIMALS.PRICE)}`}</Text.Semibold14>
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
