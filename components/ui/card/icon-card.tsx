import React from 'react';
import { IconProps } from '@phosphor-icons/react';

type IconCardProps = {
	icon: React.ForwardRefExoticComponent<IconProps>;
	boxSize?: number;
	iconSize?: number;
	onClick?: () => void;
} & Omit<IconProps, 'size'>;

function IconCard({
	icon: Icon,
	boxSize = 30,
	iconSize = 16,
	onClick,
	...props
}: IconCardProps) {
	return (
		<div
			className='border rounded-[3px] flex items-center justify-center'
			style={{ width: boxSize, height: boxSize }}
			onClick={onClick}>
			<Icon
				size={iconSize}
				{...props}
			/>
		</div>
	);
}

export default IconCard;
