import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/typography/Text';

import React from 'react';

function BorrowRepayDetailsCard() {
	return (
		<Card className='flex flex-col gap-3 p-6'>
			<div className='flex justify-between items-center'>
				<Text.Regular12>Borrow Amount</Text.Regular12>
				<Text.Regular12>67.897</Text.Regular12>
			</div>
			<Separator />
			<div className='flex justify-between items-center'>
				<Text.Regular12>rTokens unlocked</Text.Regular12>
				<Text.Regular12>67.897</Text.Regular12>
			</div>
			<Separator />
			<div className='flex justify-between items-center'>
				<Text.Regular12>est Collateral value</Text.Regular12>
				<Text.Regular12>67.897</Text.Regular12>
			</div>
		</Card>
	);
}

export default BorrowRepayDetailsCard;
