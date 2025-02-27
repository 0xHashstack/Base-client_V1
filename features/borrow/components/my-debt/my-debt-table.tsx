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
import { ImageWithLoader } from '@/components/ui/image/image-with-loader';
import MyDebtQuickStat from '../common/my-debt-quick-stat';
import { Text } from '@/components/ui/typography/Text';
import {
	HoverBorrowAprCard,
	HoverBorrowHealthCard,
	HoverBorrowValueCard,
} from '../card/hover-cards';
import { SpendCategory } from '@/types/web3/borrow.types';

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
						<TableCell>Borrow Market</TableCell>
						<TableCell>Value</TableCell>
						<TableCell></TableCell>
						<TableCell>APR</TableCell>
						<TableCell>Collateral</TableCell>
						<TableCell>Health</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.map((token) => {
						return (
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
								<TableCell>
									<HoverBorrowValueCard
										borrowAmount={400}
										tokenName={token.name}
										dTokenName={'d' + token.name}
										dTokenIssued={123123}
										pricePerToken={123123}
										tokenPrice={123123}
										dappFees={0.12}>
										<span>
											{currencyFormat(3423423423423)}
										</span>
									</HoverBorrowValueCard>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<Btn.Secondary>Spend</Btn.Secondary>
										<Btn.Outline>Repay</Btn.Outline>
									</div>
								</TableCell>
								<TableCell>
									<HoverBorrowAprCard
										netApr={2.5}
										changeInAprPercentage={-10}
										collateralApr={2.5}
										borrowApr={0.0}>
										<span>2.5%</span>
									</HoverBorrowAprCard>
								</TableCell>
								<TableCell>{token.symbol}</TableCell>
								<TableCell>
									<HoverBorrowHealthCard
										healthScore={3.34}
										actualDebt={1500}
										collateral={2000}
										netAssetValue={500}
										liquidationPrice={1200}
										debtAssetName='ETH'
										collateralAssetName='ETH'
										currentDebt={{
											dappName: 'Example Dapp',
											spendCategory: SpendCategory.Supply,
											value: 1500,
											assetName: 'ETH',
										}}>
										<span>3.34</span>
									</HoverBorrowHealthCard>
								</TableCell>
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
