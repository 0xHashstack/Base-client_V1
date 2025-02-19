import React from 'react';
import BorrowQuickStat from '../common/borrow-quick-stat';
import { useBorrowContext } from '../../context/borrow.context';
import BorrowCard from './borrow-card';

function BorrowCardStack() {
	const { tokens, tokenBalances } = useBorrowContext();
	const { formatted } = tokenBalances;

	return (
		<div className='flex flex-col gap-5'>
			<BorrowQuickStat />
			{tokens.map((token) => {
				return (
					<BorrowCard
						key={token.address}
						token={token}
						price={'1212'}
						priceChangePercentage={10}
						walletBalance={formatted[token.address]}
					/>
				);
			})}
		</div>
	);
}

export default BorrowCardStack;
