'use client';
import BorrowValueCard from '@/components/logic/card/borrow/borrow-value-card';
import { Text } from '@/components/ui/typography/Text';
import React from 'react';

function page() {
	return (
		<div className='flex flex-col items-center p-20 gap-6'>
			<div className='flex flex-col items-center gap-5'>
				<Text.Bold20>Hover cards for borrow page</Text.Bold20>
				<div className='flex gap-4 items-center flex-wrap'>
					<div className='w-[202px] border border-popover rounded-sm'>
						<BorrowValueCard
							borrowAmount={50.0}
							tokenName='HSTK'
							dTokenName='dHSTK'
							dTokenIssued={1000000}
							pricePerToken={0.0001}
							tokenPrice={0.0001}
							dappFees={0.0001}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default page;
