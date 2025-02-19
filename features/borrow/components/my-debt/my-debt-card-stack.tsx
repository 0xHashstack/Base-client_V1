import React from 'react';
import { useBorrowContext } from '../../context/borrow.context';
import MyDebtCard from './my-debt-card';
import BorrowQuickStat from '../common/borrow-quick-stat';

function MyDebtCardStack() {
	const { tokens } = useBorrowContext();

	return (
		<div className='flex flex-col gap-5'>
			<BorrowQuickStat />
			{tokens.map((token) => (
				<MyDebtCard
					key={token.address}
					token={token}
					amount="1000000"
					apy="2.5"
					healthFactor="1.5"
				/>
			))}
		</div>
	);
}

export default MyDebtCardStack;
