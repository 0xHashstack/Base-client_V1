'use client';
import React from 'react';

function page() {
	return (
		<div className='flex items-center justify-center min-h-full'>
			{/* @ts-expect-error msg */}
			<appkit-button />
		</div>
	);
}

export default page;
