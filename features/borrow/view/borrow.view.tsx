import BorrowTable from '../components/borrow-market/borrow-table';
import BorrowMobile from '../components/borrow-mobile';
import { BorrowProvider } from '../context/borrow.context';
import MyDebtTable from '../components/my-debt/my-debt-table';

function BorrowView() {
	return (
		<BorrowProvider>
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
		</BorrowProvider>
	);
}

export default BorrowView;
