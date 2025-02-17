'use client';
import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table/index';
import { Btn } from '@/components/ui/button';
import { Text } from '@/components/ui/typography/Text';
import { HoverPopover } from '@/components/ui/popover/hover-popover';
import { TokenInfo } from '@/components/web3/token/token-info';
import { useEarnContext } from '../../context/earn.context';
import EarnQuickStat from '../common/earn-quick-stat';
import Image from 'next/image';

function MySupplyTable() {
	const { tokens: coins, tokenBalances } = useEarnContext();
	const { formatted } = tokenBalances;

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>My Supply</Text.Medium20>
				<EarnQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableHead>Market</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Wallet balance</TableHead>
						<TableHead>Total Supply</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{coins.map((coin) => (
						<TableRow key={coin.address}>
							<TableCell className='font-medium'>
								<div className='flex items-center gap-3'>
									<Image
										src={coin.iconUrl}
										alt={coin.name}
										width={20}
										height={20}
									/>
									{coin.name}
								</div>
							</TableCell>
							<TableCell>{coin.name}</TableCell>
							<TableCell>
								<HoverPopover
									side='bottom'
									content={
										<TokenInfo
											name={coin.name}
											address={coin.address}
										/>
									}
									contentClassName='w-80 p-3'>
									<span>
										{formatted?.[coin.address] || '-'}
									</span>
								</HoverPopover>
							</TableCell>
							<TableCell>{coin.name}</TableCell>
							<TableCell className='w-[100px]'>
								<Btn.Primary>Supply</Btn.Primary>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default MySupplyTable;
