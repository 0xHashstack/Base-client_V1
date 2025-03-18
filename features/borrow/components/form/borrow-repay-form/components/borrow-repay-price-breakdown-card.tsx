import { Text } from '@/components/ui/typography/Text';
import { useBorrowRepayForm } from '../../../../hooks/useBorrowRepayForm';
import React from 'react';

/**
 * Component that displays the price breakdown for repaying
 */
function BorrowRepayPriceBreakdownCard() {
  const { amount, token, fee } = useBorrowRepayForm();

  // Calculate values based on amount and token
  const numericAmount = parseFloat(amount) || 0;
  const tokenPrice =
    token?.symbol === 'ETH' ? 3000
    : token?.symbol === 'USDC' ? 1
    : 60000;
  const usdValue = numericAmount * (tokenPrice || 0);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <Text.Regular12>Repay Amount</Text.Regular12>
        <Text.Regular12>
          {numericAmount.toFixed(4)} {token?.symbol || ''}
        </Text.Regular12>
      </div>
      <div className='flex items-center justify-between'>
        <Text.Regular12>USD Value</Text.Regular12>
        <Text.Regular12>${usdValue.toFixed(2)}</Text.Regular12>
      </div>
      <div className='flex items-center justify-between'>
        <Text.Regular12>Fee</Text.Regular12>
        <Text.Regular12>
          {fee} {token?.symbol || ''}
        </Text.Regular12>
      </div>
      <div className='flex items-center justify-between'>
        <Text.Regular12>Total</Text.Regular12>
        <Text.Regular12>
          {(numericAmount + parseFloat(fee)).toFixed(4)} {token?.symbol || ''}
        </Text.Regular12>
      </div>
    </div>
  );
}

export default BorrowRepayPriceBreakdownCard;
