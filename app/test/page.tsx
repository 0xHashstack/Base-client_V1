'use client';
import React from 'react';

function page() {
	return (
		<div>
			{/* @ts-expect-error msg */}
			<appkit-button />
		</div>
	);
}

export default page;
