'use client';
import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';

function IsConnectedWrapper({ children }: { children: React.ReactNode }) {
	const { isConnected } = useAccount();

	useEffect(() => {
		console.log({ isConnected });
	}, [isConnected]);
	return <>{children}</>;
}

export default IsConnectedWrapper;
