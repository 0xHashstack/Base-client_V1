import UnderLinedTab from '@/components/ui/tabs/underline-tab';
import React from 'react';
import EarnCardStack from './earn-card-stack';
import MyPositionCardStack from './my-position-card-stack';

function EarnMobile() {
	const tabs = [
		{
			value: 'my-position',
			label: 'My Position',
			content: <MyPositionCardStack />,
		},
		{
			value: 'earn',
			label: 'Earn Markets',
			content: <EarnCardStack />,
		},
	];
	return (
		<div className='flex flex-col gap-8'>
			<UnderLinedTab
				tabs={tabs}
				className='gap-8'
			/>
		</div>
	);
}

export default EarnMobile;
