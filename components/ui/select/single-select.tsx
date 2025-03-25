/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Text } from '../typography/Text';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { CaretDown } from '@phosphor-icons/react';

/**
 * Get a value from an object using a path string with dot notation
 * @param obj The object to get the value from
 * @param path The path to the value, using dot notation (e.g. 'user.address.city')
 * @returns The value at the path, or undefined if not found
 */
function getNestedValue(obj: any, path: string): any {
	if (!obj || !path) return undefined;

	const keys = path.split('.');
	let value = obj;

	for (const key of keys) {
		if (value === undefined || value === null) return undefined;
		value = value[key];
	}

	return value;
}

export type SingleSelectOption = {
	[key: string]: unknown;
};

export interface SingleSelectProps<T extends SingleSelectOption>
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
	/** Array of options to select from */
	options: T[];
	/** Currently selected value */
	value?: any;
	/** Handler for change events */
	onChange?: (value: any, option: T) => void;
	/** Key to use for option value, can be nested using dot notation (e.g. 'supplyAsset.address') */
	valueKey?: string;
	/** Key to use for option label, can be nested using dot notation (e.g. 'supplyAsset.symbol') */
	labelKey?: string;
	/** Placeholder text when no option is selected */
	placeholder?: string;
	/** Control if dropdown is open */
	isOpen?: boolean;
	/** Callback when dropdown opens or closes */
	onOpenChange?: (isOpen: boolean) => void;
	/** Disable the select */
	disabled?: boolean;
	/** Error message */
	error?: string;
	/** Label for the select */
	label?: string;
	/** Element to show before the select value */
	prefix?: React.ReactNode;
	/** Element to show after the select value */
	suffix?: React.ReactNode;
	/** Custom render function for dropdown options */
	renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
	/** Custom render function for selected value */
	renderValue?: (selectedOption: T | null) => React.ReactNode;
}

const SingleSelect = React.forwardRef<HTMLDivElement, SingleSelectProps<any>>(
	(
		{
			className,
			options,
			value,
			onChange,
			valueKey = 'value',
			labelKey = 'label',
			placeholder = 'Select an option',
			isOpen: controlledIsOpen,
			onOpenChange,
			disabled = false,
			error,
			label,
			prefix,
			suffix,
			renderOption,
			renderValue,
			...props
		},
		ref
	) => {
		const [internalIsOpen, setInternalIsOpen] = React.useState(false);
		const selectRef = React.useRef<HTMLDivElement>(null);

		// Merge the forwarded ref with our internal ref
		React.useImperativeHandle(ref, () => selectRef.current!);

		// Determine if component is controlled or uncontrolled
		const isControlled = controlledIsOpen !== undefined;
		const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

		// Handle open state changes
		const handleOpenChange = (open: boolean) => {
			if (!isControlled) {
				setInternalIsOpen(open);
			}
			onOpenChange?.(open);
		};

		// Toggle dropdown
		const toggleDropdown = () => {
			if (!disabled) {
				handleOpenChange(!isOpen);
			}
		};

		// Close dropdown when clicking outside
		useOnClickOutside(selectRef as React.RefObject<HTMLElement>, () =>
			handleOpenChange(false)
		);

		// Find the selected option
		const selectedOption = React.useMemo(() => {
			if (value === undefined || value === null) return null;
			return (
				options.find((option) =>
					typeof value === 'object' ?
						getNestedValue(option, valueKey) ===
						getNestedValue(value, valueKey)
					:	getNestedValue(option, valueKey) === value
				) || null
			);
		}, [options, value, valueKey]);

		// Handle option selection
		const handleSelectOption = (option: SingleSelectOption) => {
			if (valueKey) {
				onChange?.(getNestedValue(option, valueKey), option);
			}
			handleOpenChange(false);
		};

		// Render the display value
		const renderDisplayValue = () => {
			if (renderValue && selectedOption) {
				return renderValue(selectedOption);
			}

			if (selectedOption) {
				return (
					<Text.Regular14 textColor={500}>
						{String(getNestedValue(selectedOption, labelKey) || '')}
					</Text.Regular14>
				);
			}

			return (
				<Text.Regular14 textColor={500}>{placeholder}</Text.Regular14>
			);
		};

		return (
			<div
				className='flex flex-col gap-2'
				ref={selectRef}>
				{label && (
					<Text.Regular12 textColor={500}>{label}</Text.Regular12>
				)}

				<div
					className={cn('relative w-full')}
					{...props}>
					{/* Select trigger */}
					<div
						className={cn(
							'flex items-center justify-between rounded-md border border-input shadow-sm px-3 h-9 gap-2 cursor-pointer',
							isOpen && 'ring-1 ring-ring border-input',
							disabled && 'opacity-50 cursor-not-allowed',
							error && 'border-destructive',
							className
						)}
						onClick={toggleDropdown}>
						{prefix}
						<div className='flex-1 truncate'>
							{renderDisplayValue()}
						</div>
						{suffix || (
							<CaretDown
								size={14}
								className={cn(
									'h-4 w-4 transition-transform',
									isOpen && 'rotate-180'
								)}
							/>
						)}
					</div>

					{/* Dropdown */}
					{isOpen && (
						<div className='absolute z-50 w-full mt-1 rounded-xl border border-input bg-popover shadow-md max-h-60 overflow-auto select-none p-1 flex flex-col gap-1'>
							{options.length === 0 ?
								<div className='py-2 px-3 text-muted-foreground text-sm'>
									No options available
								</div>
							:	options.map((option, index) => {
									const isSelected =
										selectedOption ?
											getNestedValue(option, valueKey) ===
											getNestedValue(
												selectedOption,
												valueKey
											)
										:	false;

									if (renderOption) {
										return (
											<div
												key={`${String(option[valueKey])}-${index}`}
												onClick={() =>
													handleSelectOption(option)
												}
												className='cursor-pointer'>
												{renderOption(
													option,
													isSelected
												)}
											</div>
										);
									}

									return (
										<div
											key={`${String(getNestedValue(option, valueKey))}-${index}`}
											className={cn(
												'py-2 px-3 cursor-pointer hover:bg-accent rounded-md',
												isSelected && 'bg-background'
											)}
											onClick={() =>
												handleSelectOption(option)
											}>
											{String(
												getNestedValue(
													option,
													labelKey
												) || ''
											)}
										</div>
									);
								})
							}
						</div>
					)}

					{/* Error message */}
					{error && (
						<div className='mt-1'>
							<Text.Regular12 textColor='error'>
								{error}
							</Text.Regular12>
						</div>
					)}
				</div>
			</div>
		);
	}
);

// Generic factory function to properly type the Select component
export function TypedSelect<
	T extends SingleSelectOption,
>(): React.ForwardRefExoticComponent<
	SingleSelectProps<T> & React.RefAttributes<HTMLDivElement>
> {
	return SingleSelect as any;
}

SingleSelect.displayName = 'Select';

export { SingleSelect };
