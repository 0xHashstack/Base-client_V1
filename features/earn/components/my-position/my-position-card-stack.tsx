import React from 'react';
import { useEarnContext } from '../../context/earn.context';
import MyPositionQuickStat from '../common/my-position-quick-stat';
import MyPositionCard from './my-position-card';

function MyPositionCardStack() {
	const { tokens } = useEarnContext();

	return (
		<div className='flex flex-col gap-5'>
			<MyPositionQuickStat />
			{tokens.map((token) => {
				return (
					<MyPositionCard
						key={token.address}
						token={token}
						value={'123213213'}
						APR={'22'}
					/>
				);
			})}
		</div>
	);
}

export default MyPositionCardStack;
