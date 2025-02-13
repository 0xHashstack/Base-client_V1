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
import { web3DataProvider } from '@/constant/config';
import { Btn } from '@/components/ui/button';
import { useWalletTokenBalances } from '@/hooks/useWalletTokenBalance';
import { Text } from '@/components/ui/typography/Text';
import { StatCard } from '@/components/ui/card';

const coins = web3DataProvider.coins();

function EarnTable() {
	const { formatted } = useWalletTokenBalances(
		coins.map((coin) => coin.address)
	);

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Earn Markets</Text.Medium20>
				<div className='flex gap-4 items-center'>
					<StatCard
						title='Market Deposit'
						value='$97689.32'
						className='min-w-[200px]'
						isLoading
					/>

					<StatCard
						title='Market APR'
						value='3.476%'
						valueClassName='text-success'
					/>
				</div>
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
								{coin.name}
							</TableCell>
							<TableCell>{coin.name}</TableCell>
							<TableCell>
								{formatted?.[coin.address] || '-'}
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

export default EarnTable;
