'use client';
import { ConnectKitButton } from 'connectkit';
import React from 'react';

function page() {
	return (
		<div className='flex justify-center items-center min-h-screen'>
			<ConnectKitButton.Custom>
				{({ isConnected, show, address }) => {
					return (
						<button
							onClick={show}
							className='px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0'>
							{isConnected ?
								<span className='font-mono'>
									{`${address!.slice(0, 6)}...${address!.slice(-4)}`}
								</span>
							:	'Connect Wallet'}
						</button>
					);
				}}
			</ConnectKitButton.Custom>
		</div>
	);
}

export default page;
