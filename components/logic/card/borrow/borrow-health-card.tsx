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

type MetricRow = { label: string; value: string };
type CurrentDebtRow = {
	value: string;
	badgeText: string;
	icon?: string;
};

const HealthDisplay: React.FC<{ score: number }> = ({ score }) => (
	<div className='flex flex-col'>
		<Text.Regular10 textColor={500}>Health</Text.Regular10>
		<Text.Semibold14>{score.toFixed(3)}</Text.Semibold14>
	</div>
);

const MetricItem: React.FC<MetricRow> = ({ label, value }) => (
	<div className='flex items-center justify-between gap-1'>
		<Text.Medium12 textColor={600}>{label}</Text.Medium12>
		<Text.Medium12>{value}</Text.Medium12>
	</div>
);

const DebtInfoItem: React.FC<{
	value: string;
	badgeText: string;
	icon?: string;
}> = ({ value, badgeText, icon }) => (
	<div className='flex items-center gap-3'>
		<div className='flex items-center gap-2'>
			{icon && (
				<ImageWithLoader
					src={icon}
					width={14}
					height={14}
					alt='dapp icon'
				/>
			)}
			<Text.Regular10>{value}</Text.Regular10>
		</div>
		<Badge
			variant='secondary'
			className='text-[10px]'>
			{badgeText}
		</Badge>
	</div>
);

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
	const metrics = useMemo(() => {
		type MetricData = [string, number | undefined, (val: number) => string];

		const metricConfigs: MetricData[] = [
			['Debt Actual', actualDebt, (val) => `${val}${debtAssetName}`],
			['Collateral', collateral, (val) => `${val}${collateralAssetName}`],
			['Net Asset Value', netAssetValue, currencyFormat],
			['Liquidation Price', liquidationPrice, currencyFormat],
		];

		return metricConfigs
			.filter(
				(item): item is [string, number, (val: number) => string] =>
					item[1] !== undefined
			)
			.map(
				([label, value, formatter]): MetricRow => ({
					label,
					value: formatter(value),
				})
			);
	}, [
		actualDebt,
		collateral,
		netAssetValue,
		liquidationPrice,
		debtAssetName,
		collateralAssetName,
	]);

	const currentDebtItems = useMemo<CurrentDebtRow[]>(() => {
		if (!currentDebt) return [];

		return [
			currentDebt.dappName && {
				value: currentDebt.dappName,
				badgeText: 'dapp name',
				icon: currentDebt.dappIcon,
			},
			currentDebt.spendCategory && {
				value: currentDebt.spendCategory,
				badgeText: 'spend category',
			},
			currentDebt.value && {
				value: currencyFormat(currentDebt.value),
				badgeText: 'value',
			},
			currentDebt.assetName && {
				value: currentDebt.assetName,
				badgeText: 'asset',
			},
		].filter(Boolean) as CurrentDebtRow[];
	}, [currentDebt]);

	return (
		<div className='flex flex-col'>
			<div className='p-4 flex items-center justify-between gap-1'>
				<HealthDisplay score={healthScore} />
			</div>

			<div className='p-4 flex flex-col gap-3.5 border-t rounded-xl'>
				{metrics.map((metric) => (
					<MetricItem
						key={metric.label}
						label={metric.label}
						value={metric.value}
					/>
				))}

				<If isTrue={currentDebtItems.length > 0}>
					<div className='flex flex-col gap-3'>
						<Separator />
						<Text.Semibold12>Debt Current</Text.Semibold12>
						{currentDebtItems.map((item, index) => (
							<DebtInfoItem
								key={index}
								value={item.value}
								badgeText={item.badgeText}
								icon={item.icon}
							/>
						))}
					</div>
				</If>
			</div>
		</div>
	);
}

export default BorrowHealthCard;
