import { Btn } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useBorrowContext } from '../../context/borrow.context';
import { currencyFormat } from '@/utils';
import Image from 'next/image';

function MyDebtTable() {
	const { tokens } = useBorrowContext();

	return (
		<div className='flex flex-col gap-6'>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableCell>Asset</TableCell>
						<TableCell>Debt</TableCell>
						<TableCell>APY</TableCell>
						<TableCell>Health Factor</TableCell>
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.map((token) => {
						return (
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
								<TableCell>
									{currencyFormat('2342134124')}
								</TableCell>
								<TableCell>2.5%</TableCell>
								<TableCell>2.5%</TableCell>
								<TableCell className='w-[100px]'>
									<Btn.Primary>Repay</Btn.Primary>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default MyDebtTable;
