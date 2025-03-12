import { Text } from '@/components/ui/typography/Text';
import React from 'react';

/**
 * APR information for the supply form
 */
type APRInfo = {
	totalAPR: string;
	supplyAPR: string;
	rewardsAPR: string;
};

/**
 * Default APR information
 */
const DEFAULT_APR_INFO: APRInfo = {
	totalAPR: '0.15%',
	supplyAPR: '5.73%',
	rewardsAPR: '5.73%',
};

/**
 * Props for the SupplyFormAPR component
 */
interface SupplyFormAPRProps {
	/**
	 * APR information to display
	 */
	aprInfo?: APRInfo;
}

/**
 * Component that displays APR information in an accordion card
 */
const SupplyFormAPR: React.FC<SupplyFormAPRProps> = ({
	aprInfo = DEFAULT_APR_INFO,
}) => {
	const { totalAPR, supplyAPR, rewardsAPR } = aprInfo;

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<Text.Regular12>APR</Text.Regular12>
				<Text.Regular12>{totalAPR}</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12 textColor={500}>Supply APR</Text.Regular12>
				<Text.Regular12>{supplyAPR}</Text.Regular12>
			</div>
			<div className='flex items-center justify-between'>
				<Text.Regular12 textColor={500}>HSTK Rewards</Text.Regular12>
				<Text.Regular12>{rewardsAPR}</Text.Regular12>
			</div>
		</div>
	);
};

export default SupplyFormAPR;
