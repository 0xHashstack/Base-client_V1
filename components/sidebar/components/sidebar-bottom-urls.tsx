import { ArrowSquareOut } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { SIDEBAR_BOTTOM_LINKS } from '../constant';

function SidebarBottomUrls() {
	const router = useRouter();

	const handleClick = (href: string, isExternal?: boolean) => {
		if (isExternal) {
			window.open(href, '_blank');
		} else {
			router.push(href);
		}
	};

	return (
		<div className='flex flex-col gap-2'>
			{SIDEBAR_BOTTOM_LINKS.map((link, index) => (
				<button
					key={index}
					className='flex items-center justify-between flex-1 px-3 py-2 text-[13px] text-primary-600 hover:bg-accent rounded-md transition-colors'
					onClick={() => handleClick(link.href, link.isExternal)}>
					<div className='flex items-center gap-3'>
						{link.icon}
						<span>{link.title}</span>
					</div>
					{link.isExternal && <ArrowSquareOut size={16} />}
				</button>
			))}
		</div>
	);
}

export default SidebarBottomUrls;
