import UnderLinedTab from '@/components/ui/tabs/underline-tab';
import React from 'react';
import BorrowCardStack from './borrow-market/borrow-card-stack';
import MyDebtCardStack from './my-debt/my-debt-card-stack';

function BorrowMobile() {
	const tabs = [
		{
			value: 'my-debt',
			label: 'My Debt',
			content: <MyDebtCardStack />,
		},
		{
			value: 'borrow-market',
			label: 'Borrow Market',
			content: <BorrowCardStack />,
		},
	];

	return (
		<div className='flex flex-col'>
			<UnderLinedTab
				tabs={tabs}
				className='gap-8'
				tabListClassName='sticky top-header bg-background'
			/>
		</div>
	);
}

export default BorrowMobile;
