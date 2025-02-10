import { ICON } from '@/constant/assets/assets.constnat';
import Image from 'next/image';
import React from 'react';

function HstkIcon() {
	return (
		<Image
			width={20}
			height={20}
			alt='hstk icon'
			src={ICON.LOGO}
		/>
	);
}

export default HstkIcon;
