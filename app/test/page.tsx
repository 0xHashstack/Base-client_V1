'use client';

import {
	ConnectButton,
	useAccountModal,
	useChainModal,
	useConnectModal,
} from '@rainbow-me/rainbowkit';
import React from 'react';

function page() {
	const { openConnectModal } = useConnectModal();
	const { openAccountModal } = useAccountModal();
	const { openChainModal } = useChainModal();
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<ConnectButton label='Connect With Wallet' />
			<>
				{openConnectModal && (
					<button
						onClick={openConnectModal}
						type='button'>
						Open Connect Modal
					</button>
				)}

				{openAccountModal && (
					<button
						onClick={openAccountModal}
						type='button'>
						Open Account Modal
					</button>
				)}

				{openChainModal && (
					<button
						onClick={openChainModal}
						type='button'>
						Open Chain Modal
					</button>
				)}
			</>
		</div>
	);
}

export default page;
