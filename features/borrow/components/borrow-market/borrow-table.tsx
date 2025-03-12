import { Btn } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
	TableNoData,
} from '@/components/ui/table';
import { useBorrowContext } from '../../context/borrow.context';
import BorrowQuickStat from '../common/borrow-quick-stat';
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import { currencyFormat } from '@/utils';
import { Text } from '@/components/ui/typography/Text';
import If from '@/components/common/If';

function BorrowTable() {
	const { tokens } = useBorrowContext();

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>Borrow Markets</Text.Medium20>
				<BorrowQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableCell>Borrow Market</TableCell>
						<TableCell>Price</TableCell>
						<TableCell>Utilization Rate</TableCell>
						<TableCell>Borrow APR</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					<If isTrue={tokens.length === 0}>
						<TableNoData
							message='No borrow markets available'
							colSpan={5}
						/>
						<>
							{tokens.map((token) => (
								<TableRow key={token.address}>
									<TableCell className='font-medium'>
										<div className='flex items-center gap-3'>
											<ImageWithLoader
												src={token.iconUrl}
												alt={token.name}
												width={20}
												height={20}
												className='rounded-full'
											/>
											{token.name}
										</div>
									</TableCell>
									<TableCell>
										{currencyFormat('1000000')}
									</TableCell>
									<TableCell>80.00%</TableCell>
									<TableCell>2.5%</TableCell>
									<TableCell className='w-[100px]'>
										<Btn.Secondary>Borrow</Btn.Secondary>
									</TableCell>
								</TableRow>
							))}
						</>
					</If>
				</TableBody>
			</Table>
		</div>
	);
}

export default BorrowTable;
