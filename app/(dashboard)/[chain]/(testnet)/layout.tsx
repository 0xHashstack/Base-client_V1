import NotFoundBase from '@/components/404/not-found.component';
import { CURRENT_NETWORK } from '@/constant/config';
import { ChainNetwork } from '@/types/web3';

import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
	if (CURRENT_NETWORK === ChainNetwork.MAINNET) {
		return <NotFoundBase />;
	}
	return children;
}

export default layout;
