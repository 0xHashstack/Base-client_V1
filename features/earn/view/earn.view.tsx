import React from 'react';
import EarnTable from '../components/earn-market/earn-table';
import EarnMobile from '../components/earn-mobile';

import MyPositionsTable from '../components/my-position/my-position-table';
import EarnWrapper from '../components/earn-wrapper';

function EarnView() {
	return (
		<EarnWrapper>
			<div className='flex flex-col flex-1 relative'>
				<div className='block tablet:hidden'>
					<EarnMobile />
				</div>
				<div className='hidden tablet:block'>
					<div className='flex flex-col gap-9'>
						<MyPositionsTable />
						<EarnTable />
					</div>
				</div>
			</div>
		</EarnWrapper>
	);
}

export default EarnView;
