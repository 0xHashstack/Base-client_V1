import React, { SVGProps } from 'react';

function HstkIcon({
	id = 'hstk-logo-svg',
	...props
}: SVGProps<SVGSVGElement> & { id: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={27}
			height={27}
			fill='none'
			{...props}>
			<path
				fill={`url(#${id})`}
				d='M13.357 26.714c7.377 0 13.357-5.98 13.357-13.357C26.714 5.98 20.734 0 13.357 0 5.98 0 0 5.98 0 13.357c0 7.377 5.98 13.357 13.357 13.357Z'
			/>
			<path
				fill='#fff'
				d='M7.057 4.406h2.17v6.61h8.227v-6.61h2.169v8.607H7.057V4.406ZM7.057 13.529h12.566v8.606h-2.17v-6.61H9.227v6.61H7.057v-8.606Z'
			/>
			<defs>
				<linearGradient
					id={id}
					x1={-0.024}
					x2={26.714}
					y1={13.344}
					y2={13.344}
					gradientUnits='userSpaceOnUse'>
					<stop stopColor='#7956EA' />
					<stop
						offset={0.175}
						stopColor='#634CDC'
					/>
					<stop
						offset={0.535}
						stopColor='#3C39C2'
					/>
					<stop
						offset={0.823}
						stopColor='#242DB2'
					/>
					<stop
						offset={1}
						stopColor='#1B29AC'
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}

export default HstkIcon;
