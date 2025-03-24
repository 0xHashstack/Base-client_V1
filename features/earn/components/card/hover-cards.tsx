import SupplyValueCard from '@/components/logic/card/supply/supply-value-card';
import { HoverPopover } from '@/components/ui/popover/hover-popover';
import { SupplyPosition } from '@/types/web3/supply-market.types';
import React from 'react';

interface HoverSupplyValueCardProps {
  supplyData: SupplyPosition;
  children: React.ReactNode;
}

export function HoverSupplyValueCard({
  children,
  supplyData
}: HoverSupplyValueCardProps) {
  return (
    <HoverPopover
      side="right"
      content={<SupplyValueCard supplyData={supplyData} />}
      contentClassName="w-[220px]"
    >
      {children}
    </HoverPopover>
  );
}
