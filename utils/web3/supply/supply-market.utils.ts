import { BorrowMarketCollateral } from '@/types/web3/borrow-market.types';
import { UserSupplyData } from '@/types/web3/supply-market.types';

export const transformToBorrowMarketCollateral = (
	payload: UserSupplyData
): BorrowMarketCollateral[] => {
	const { supplyPositions, markets } = payload;
	const marketCollateral: BorrowMarketCollateral[] = markets.map((market) => {
		const { asset } = market;
		return {
			address: asset.address_,
			name: asset.name,
			symbol: asset.symbol,
			decimals: asset.decimals,
			logoURI: asset.logoURI,
			isRToken: false,
		};
	});
	const rMarketCollateral: BorrowMarketCollateral[] = supplyPositions.map(
		(position) => {
			const { supplyAsset, underlyingAsset } = position;
			return {
				address: supplyAsset.address_,
				name: supplyAsset.name,
				symbol: supplyAsset.symbol,
				decimals: supplyAsset.decimals,
				logoURI: underlyingAsset.logoURI,
				isRToken: true,
			};
		}
	);
	return [...marketCollateral, ...rMarketCollateral];
};
