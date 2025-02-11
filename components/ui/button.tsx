import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				primary:
					'bg-button-primary text-button-primary-text  hover:bg-button-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline:
					'border border-button-outline-border bg-transparent text-button-outline-text hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-button-secondary text-button-secondary-text hover:bg-button-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-8 px-[16px] text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

const createButtonVariant = (
	variant: ButtonProps['variant'],
	size: ButtonProps['size']
) => {
	const VariantButton = ({
		...props
	}: Omit<ButtonProps, 'variant' | 'size'>) => (
		<Button
			variant={variant}
			size={size}
			{...props}
		/>
	);
	VariantButton.displayName = `Button.${variant!.charAt(0).toUpperCase() + variant!.slice(1)}`;
	return VariantButton;
};

export const Btn = {
	Primary: createButtonVariant('primary', 'default'),
	Secondary: createButtonVariant('secondary', 'default'),
	Destructive: createButtonVariant('destructive', 'default'),
	Outline: createButtonVariant('outline', 'default'),
	Ghost: createButtonVariant('ghost', 'default'),
	Link: createButtonVariant('link', 'default'),
	Icon: createButtonVariant('primary', 'icon'),
	Large: createButtonVariant('primary', 'lg'),
};

export { Button, buttonVariants };
