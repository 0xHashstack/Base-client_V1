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
import { FallbackImage } from '@/components/ui/image/fallback-image';
import MyDebtQuickStat from '../common/my-debt-quick-stat';
import { Text } from '@/components/ui/typography/Text';

function MyDebtTable() {
	const { tokens } = useBorrowContext();

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex justify-between items-center gap-4 flex-wrap'>
				<Text.Medium20>My Debt Positions</Text.Medium20>

				<MyDebtQuickStat />
			</div>
			<Table isPrimary>
				<TableHeader>
					<TableRow>
						<TableCell>Asset</TableCell>
						<TableCell>Debt</TableCell>
						<TableCell>APY</TableCell>
						<TableCell>Health Factor</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.map((token) => {
						return (
							<TableRow key={token.address}>
								<TableCell className='font-medium'>
									<div className='flex items-center gap-3'>
										<FallbackImage
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
