import { HstkToken } from './token.types';

export type CollateralToken = HstkToken & {
	availableCollateral?: number;
};
