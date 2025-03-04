import React, { useCallback } from 'react';
import { useEarnContext } from '../../context/earn.context';
import MyPositionQuickStat from '../common/my-position-quick-stat';
import MyPositionCard from './my-position-card';
import { useEarnDrawer } from '../../context/earn-drawer.context';
import SupplyForm from '../form/supply-form';
import { HstkToken } from '@/types/web3';
import SupplyWithdrawForm from '../form/supply-withdraw-form';

function MyPositionCardStack() {
	const { tokens } = useEarnContext();
	const { openDrawer, setDrawerContent } = useEarnDrawer();

	/**
	 * Handle opening the supply form
	 */
	const handleOpenSupplyForm = useCallback(
		(token: HstkToken) => {
			setDrawerContent(<SupplyForm token={token} />);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);

	/**
	 * Handle opening the withdraw form
	 */
	const handleOpenWithdrawForm = useCallback(
		(token: HstkToken) => {
			setDrawerContent(<SupplyWithdrawForm token={token} />);
			openDrawer();
		},
		[setDrawerContent, openDrawer]
	);
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
						onAddClick={handleOpenSupplyForm}
						onWithdrawClick={handleOpenWithdrawForm}
					/>
				);
			})}
		</div>
	);
}

export default MyPositionCardStack;
