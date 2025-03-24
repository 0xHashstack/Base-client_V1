import React from 'react';

import { ImageWithLoader } from '../image/image-with-loader';

type ImageCardProps = {
	imageUrl: string;
	boxSize?: number;
	imageSize?: number;
	onClick?: () => void;
};

function ImageCard({
	imageUrl,
	boxSize = 30,
	imageSize = 16,
	onClick,
}: ImageCardProps) {
	return (
		<div
			className='border rounded-[3px] flex items-center justify-center'
			style={{ width: boxSize, height: boxSize }}
			onClick={onClick}>
			<ImageWithLoader
				src={imageUrl}
				width={imageSize}
				height={imageSize}
				alt='dapp icon'
			/>
		</div>
	);
}

export default ImageCard;
