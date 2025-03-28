import BorrowTable from '../components/borrow-market/borrow-table';
import BorrowMobile from '../components/borrow-mobile';
import MyDebtTable from '../components/my-debt/my-debt-table';
import BorrowWrapper from '../components/borrow-wrapper';
import BorrowDataFetcher from '../components/data-fetcher/borrow-data-fetcher';
import EarnDataFetcher from '@/features/earn/components/data-fetcher/earn-data-fetcher';

function BorrowView() {
	return (
		<BorrowWrapper>
			<BorrowDataFetcher />
			<EarnDataFetcher />
			<div className='flex flex-col flex-1 relative'>
				<div className='block tablet:hidden'>
					<BorrowMobile />
				</div>
				<div className='hidden tablet:block'>
					<div className='flex flex-col gap-9'>
						<MyDebtTable />
						<BorrowTable />
					</div>
				</div>
			</div>
		</BorrowWrapper>
	);
}

export default BorrowView;
