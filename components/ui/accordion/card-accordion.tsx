'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '@/lib/utils';

interface CardAccordionProps {
	/**
	 * The header content of the accordion card
	 */
	header: React.ReactNode;
	/**
	 * The body content of the accordion card
	 */
	children: React.ReactNode;
	/**
	 * Whether the accordion is collapsible or always expanded
	 * @default true
	 */
	collapsible?: boolean;
	/**
	 * Whether the accordion is initially expanded (only applicable when collapsible is true)
	 * @default false
	 */
	defaultExpanded?: boolean;
	/**
	 * Optional CSS class name for the card container
	 */
	className?: string;
	/**
	 * Optional CSS class name for the header
	 */
	headerClassName?: string;
	/**
	 * Optional CSS class name for the body
	 */
	bodyClassName?: string;
	/**
	 * Optional CSS class name for the chevron icon
	 */
	iconClassName?: string;
	/**
	 * Callback fired when the expanded state changes
	 */
	onExpandedChange?: (expanded: boolean) => void;
	/**
	 * Control the expanded state (controlled component)
	 */
	expanded?: boolean;
}

/**
 * CardAccordion component that can be used as a regular card or an accordion
 *
 * @example
 * // Basic usage
 * <CardAccordion header="Fees">
 *   <p>Content goes here</p>
 * </CardAccordion>
 *
 * @example
 * // Non-collapsible card
 * <CardAccordion header="Fees" collapsible={false}>
 *   <p>Always visible content</p>
 * </CardAccordion>
 *
 * @example
 * // Controlled component
 * <CardAccordion
 *   header="Fees"
 *   expanded={isExpanded}
 *   onExpandedChange={setIsExpanded}
 * >
 *   <p>Controlled content</p>
 * </CardAccordion>
 */
const CardAccordion = React.forwardRef<HTMLDivElement, CardAccordionProps>(
	(
		{
			header,
			children,
			collapsible = true,
			defaultExpanded = false,
			className,
			headerClassName,
			bodyClassName,
			iconClassName,
			onExpandedChange,
			expanded: controlledExpanded,
			...props
		},
		ref
	) => {
		// For non-collapsible mode or when using the component as controlled
		const [internalExpanded, setInternalExpanded] =
			React.useState(defaultExpanded);

		// Determine if expanded (controlled or uncontrolled)
		const isExpanded =
			controlledExpanded !== undefined ? controlledExpanded : (
				internalExpanded
			);

		// Handle expansion state change
		const handleExpandedChange = React.useCallback(
			(value: boolean) => {
				if (controlledExpanded === undefined) {
					setInternalExpanded(value);
				}
				onExpandedChange?.(value);
			},
			[controlledExpanded, onExpandedChange]
		);

		// If not collapsible, render a simple card
		if (!collapsible) {
			return (
				<div
					ref={ref}
					className={cn(
						'rounded-lg border bg-card text-card-foreground shadow-sm',
						className
					)}
					{...props}>
					<div
						className={cn(
							'flex flex-1 items-center justify-between p-4 text-sm font-medium',
							headerClassName
						)}>
						{header}
					</div>
					<div className='flex flex-col gap-3 px-4 pb-4'>
						<div className='w-full border-t border-dashed'></div>
						<div className={cn(bodyClassName)}>{children}</div>
					</div>
				</div>
			);
		}

		// For collapsible mode, use Radix Accordion
		return (
			<AccordionPrimitive.Root
				type='single'
				defaultValue={defaultExpanded ? 'item' : undefined}
				value={isExpanded ? 'item' : undefined}
				onValueChange={(value) =>
					handleExpandedChange(value === 'item')
				}
				collapsible
				className={cn(
					'rounded-lg border bg-card text-card-foreground',
					className
				)}
				{...props}>
				<AccordionPrimitive.Item
					value='item'
					className='border-0'>
					<AccordionPrimitive.Header>
						<AccordionPrimitive.Trigger
							className={cn(
								'flex w-full items-center justify-between p-4 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180',
								headerClassName
							)}>
							{header}
							<ChevronDown
								className={cn(
									'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
									iconClassName
								)}
							/>
						</AccordionPrimitive.Trigger>
					</AccordionPrimitive.Header>
					<AccordionPrimitive.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
						<div className='flex flex-col gap-3 px-4 pb-4'>
							<div className='w-full border-t border-dashed'></div>
							<div className={cn(bodyClassName)}>{children}</div>
						</div>
					</AccordionPrimitive.Content>
				</AccordionPrimitive.Item>
			</AccordionPrimitive.Root>
		);
	}
);

CardAccordion.displayName = 'CardAccordion';

export { CardAccordion };
