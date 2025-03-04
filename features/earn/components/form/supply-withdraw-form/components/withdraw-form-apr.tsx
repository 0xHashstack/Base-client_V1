'use client';
import React, { useMemo } from 'react';
import { CardAccordion } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography/Text';

/**
 * APR information for the withdraw form
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
  rewardsAPR: '5.73%'
};

/**
 * Props for the WithdrawFormAPR component
 */
interface WithdrawFormAPRProps {
  /**
   * APR information to display
   */
  aprInfo?: APRInfo;
  /**
   * CSS class name for the card
   */
  className?: string;
}

/**
 * Component that displays APR information in an accordion card
 */
const WithdrawFormAPR: React.FC<WithdrawFormAPRProps> = ({ 
  aprInfo = DEFAULT_APR_INFO,
  className
}) => {
  const { totalAPR, supplyAPR, rewardsAPR } = aprInfo;
  
  // Memoize the header to prevent unnecessary re-renders
  const cardHeader = useMemo(() => (
    <div className='flex flex-1 items-center justify-between'>
      <Text.Regular12>APR</Text.Regular12>
      <Text.Regular12>{totalAPR}</Text.Regular12>
    </div>
  ), [totalAPR]);
  
  return (
    <CardAccordion
      header={cardHeader}
      className={className}
      collapsible={false}>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <Text.Regular12 textColor={500}>Supply APR</Text.Regular12>
          <Text.Regular12>{supplyAPR}</Text.Regular12>
        </div>
        <div className='flex items-center justify-between'>
          <Text.Regular12 textColor={500}>
            HSTK Rewards
          </Text.Regular12>
          <Text.Regular12>{rewardsAPR}</Text.Regular12>
        </div>
      </div>
    </CardAccordion>
  );
};

export default WithdrawFormAPR;
