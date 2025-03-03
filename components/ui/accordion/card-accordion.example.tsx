'use client';

import React, { useState } from 'react';
import { CardAccordion } from './card-accordion';

export function CardAccordionExample() {
	// Example of controlled component
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className='flex flex-col gap-4'>
			{/* Basic collapsible example */}
			<CardAccordion
				header={<h3 className='text-lg font-medium'>Fees</h3>}
				className='w-full'>
				<div className='flex flex-col gap-2'>
					<div className='flex justify-between'>
						<span>Network fees</span>
						<span>0.0003 ETH</span>
					</div>
					<div className='flex justify-between'>
						<span>Dapp fees</span>
						<span>0.15%</span>
					</div>
				</div>
			</CardAccordion>

			{/* Non-collapsible example */}
			<CardAccordion
				header={
					<h3 className='text-lg font-medium'>Transaction Details</h3>
				}
				collapsible={false}
				className='w-full'>
				<div className='flex flex-col gap-2'>
					<div className='flex justify-between'>
						<span>Transaction ID</span>
						<span>0x123...abc</span>
					</div>
					<div className='flex justify-between'>
						<span>Status</span>
						<span className='text-green-500'>Confirmed</span>
					</div>
				</div>
			</CardAccordion>

			{/* Controlled component example */}
			<div>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className='mb-2 px-4 py-2 bg-primary text-primary-foreground rounded'>
					Toggle Expansion
				</button>
				<CardAccordion
					header={
						<h3 className='text-lg font-medium'>
							Controlled Accordion
						</h3>
					}
					expanded={isExpanded}
					onExpandedChange={setIsExpanded}
					className='w-full'>
					<p>
						This accordion is controlled externally through the
						toggle button above.
					</p>
				</CardAccordion>
			</div>
		</div>
	);
}
