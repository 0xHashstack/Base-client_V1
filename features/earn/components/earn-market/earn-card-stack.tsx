import React from 'react';
import EarnQuickStat from '../common/earn-quick-stat';
import { useEarnContext } from '../../context/earn.context';
import EarnSupplyCard from './earn-supply-card';

function EarnCardStack() {
	const { coins, tokenBalances } = useEarnContext();
	const { formatted } = tokenBalances;

	return (
		<div className='flex flex-col gap-5'>
			<EarnQuickStat />
			{coins.map((coin) => {
				return (
					<EarnSupplyCard
						key={coin.address}
						coin={coin}
						price={'1212'}
						priceChangePercentage={10}
						walletBalance={formatted[coin.address]}
					/>
				);
			})}
		</div>
	);
}

export default EarnCardStack;
