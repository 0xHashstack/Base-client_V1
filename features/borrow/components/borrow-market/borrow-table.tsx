import { Btn } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { TokenInfo } from '@/components/web3/token/token-info';
import { useBorrowContext } from '../../context/borrow.context';
import BorrowQuickStat from '../common/borrow-quick-stat';
import Image from 'next/image';
import { currencyFormat } from '@/utils';
import { HoverPopover } from '@/components/ui/popover/hover-popover';

function BorrowTable() {
	const { tokens, tokenBalances } = useBorrowContext();
	const { formatted } = tokenBalances;

	return (
		<div className='flex flex-col gap-6'>
			<BorrowQuickStat />
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableCell>Asset</TableCell>
						<TableCell>Available</TableCell>
						<TableCell>Wallet Balance</TableCell>
						<TableCell>APY</TableCell>
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.map((token) => (
						<TableRow key={token.address}>
							<TableCell className='font-medium'>
								<div className='flex items-center gap-3'>
									<Image
										src={token.iconUrl}
										alt={token.name}
										width={20}
										height={20}
									/>
									{token.name}
								</div>
							</TableCell>
							<TableCell>{currencyFormat('1000000')}</TableCell>
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
									<span className='cursor-help underline decoration-dashed'>
										{formatted?.[token.address] || '-'}
									</span>
								</HoverPopover>
							</TableCell>
							<TableCell>2.5%</TableCell>
							<TableCell className='w-[100px]'>
								<Btn.Primary>Borrow</Btn.Primary>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default BorrowTable;
