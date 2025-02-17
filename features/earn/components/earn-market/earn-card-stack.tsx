import React from 'react';
import EarnQuickStat from '../common/earn-quick-stat';
import { useEarnContext } from '../../context/earn.context';
import EarnSupplyCard from './earn-supply-card';

function EarnCardStack() {
	const { tokens, tokenBalances } = useEarnContext();
	const { formatted } = tokenBalances;

	return (
		<div className='flex flex-col gap-5'>
			<EarnQuickStat />
			{tokens.map((token) => {
				return (
					<EarnSupplyCard
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

export default EarnCardStack;
