import * as React from 'react';
import { cn } from '@/lib/utils';
import { Text } from './typography/Text';

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	validator?: (value: string) => boolean | RegExp;
	label?: string;
	parentClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			prefix,
			suffix,
			validator,
			onChange,
			label,
			parentClassName,
			...props
		},
		ref
	) => {
		// Custom onChange handler with validation
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;

			// Apply validation if provided
			if (validator) {
				if (validator instanceof RegExp) {
					// If validator is a RegExp
					if (!validator.test(value) && value !== '') {
						return;
					}
				} else if (typeof validator === 'function') {
					// If validator is a function
					if (!validator(value)) {
						return;
					}
				}
			}

			// Call the original onChange if it exists
			onChange?.(e);
		};

		// CSS to hide number input arrows
		const numberInputStyles =
			type === 'number' ?
				'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
			:	'';

		return (
			<div className='flex flex-col gap-2'>
				{label && (
					<Text.Regular12 textColor={500}>{label}</Text.Regular12>
				)}
				<div
					className={cn(
						'flex items-center rounded-md border border-input shadow-sm focus-within:ring-1 focus-within:ring-ring focus-within:border-input px-3 gap-2',
						parentClassName
					)}>
					{prefix}
					<input
						type={type}
						className={cn(
							'flex-1 h-9 w-full bg-transparent text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 tablet:text-sm border-0',
							numberInputStyles,
							className
						)}
						onChange={handleChange}
						ref={ref}
						{...props}
					/>
					{suffix}
				</div>
			</div>
		);
	}
);
Input.displayName = 'Input';

export const CustomInput = {
	Amount: ({ className, parentClassName, ...props }: InputProps) => (
		<Input
			className={cn('md:text-2xl', className)}
			parentClassName={cn(
				'p-0 border-none shadow-none focus-within:ring-0 ',
				parentClassName
			)}
			{...props}
		/>
	),
};

export { Input };
