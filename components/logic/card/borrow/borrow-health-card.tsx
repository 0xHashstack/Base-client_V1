import { CurrentDebt } from '@/types/web3/borrow.types';
import React from 'react';

export type BorrowHealthCardProps = {
	healthScore: number;
	actualDebt?: number;
	collateral?: number;
	netAssetValue?: number;
	liquidationPrice?: number;
	currentDebt?: CurrentDebt;
};

function BorrowHealthCard({
	healthScore,
	actualDebt,
	collateral,
	netAssetValue,
	liquidationPrice,
	currentDebt,
}: BorrowHealthCardProps) {
	return <div></div>;
}

export default BorrowHealthCard;
