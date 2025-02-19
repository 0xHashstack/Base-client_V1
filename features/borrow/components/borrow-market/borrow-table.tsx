import { Btn } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { useBorrowContext } from '../../context/borrow.context';
import BorrowQuickStat from '../common/borrow-quick-stat';
import { FallbackImage } from '@/components/ui/image/fallback-image';
import { currencyFormat } from '@/utils';
import { Text } from '@/components/ui/typography/Text';

function BorrowTable() {
	const { tokens, tokenBalances } = useBorrowContext();
	const { formatted } = tokenBalances;

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Borrow Markets</Text.Medium20>
				<BorrowQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableCell>Asset</TableCell>
						<TableCell>Available</TableCell>
						<TableCell>Wallet Balance</TableCell>
						<TableCell>APY</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.map((token) => (
						<TableRow key={token.address}>
							<TableCell className='font-medium'>
								<div className='flex items-center gap-3'>
									<FallbackImage
										src={token.iconUrl}
										alt={token.name}
										width={20}
										height={20}
										className='rounded-full'
									/>
									{token.name}
								</div>
							</TableCell>
							<TableCell>{currencyFormat('1000000')}</TableCell>
							<TableCell>
								{formatted?.[token.address] || '-'}
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
