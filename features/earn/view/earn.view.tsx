import React from 'react';
import EarnTable from '../components/earn-market/earn-table';
import EarnMobile from '../components/earn-mobile';
import { EarnProvider } from '../context/earn.context';

function EarnView() {
	return (
		<EarnProvider>
			<div className='flex flex-col flex-1'>
				<div className='block tablet:hidden'>
					<EarnMobile />
				</div>
				<div className='hidden tablet:block'>
					<EarnTable />
				</div>
			</div>
		</EarnProvider>
	);
}

export default EarnView;
