import { ICON } from '@/constant/assets/assets.constant';
import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { getShimmerDataUrl } from '@/utils/shimmer.utils';

const defaultPlaceholder = ICON.LOGO;

export function ImageWithLoader({
	src,
	alt,
	width = 24,
	height = 24,
	...props
}: Omit<ImageProps, 'onError'>) {
	const [imgSrc, setImgSrc] = useState(src);

	useEffect(() => {
		setImgSrc(src);
	}, [src]);

	return (
		<Image
			{...props}
			src={imgSrc || defaultPlaceholder}
			alt={alt}
			width={width}
			height={height}
			onError={() => setImgSrc(defaultPlaceholder)}
			blurDataURL={getShimmerDataUrl(width as number, height as number)}
			placeholder='blur'
		/>
	);
}
