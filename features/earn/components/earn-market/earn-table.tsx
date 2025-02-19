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
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';

function EarnTable() {
	const { tokens, tokenBalances } = useEarnContext();
	const { formatted } = tokenBalances;

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Earn Markets</Text.Medium20>
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
					{tokens.map((token) => (
						<TableRow key={token.address}>
							<TableCell className='font-medium'>
								<div className='flex items-center gap-3'>
									<ImageWithLoader
										src={token.iconUrl}
										alt={token.name}
										width={20}
										height={20}
									/>
									{token.name}
								</div>
							</TableCell>
							<TableCell>{token.name}</TableCell>
							<TableCell>
								<HoverPopover
									side='bottom'
									content={
										<TokenInfo
											name={token.name}
											address={token.address}
										/>
									}
									contentClassName='w-80 p-3'>
									<span>
										{formatted?.[token.address] || '-'}
									</span>
								</HoverPopover>
							</TableCell>
							<TableCell>{token.name}</TableCell>
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

export default EarnTable;
