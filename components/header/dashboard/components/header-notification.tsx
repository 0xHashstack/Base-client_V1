import { Button } from '@/components/ui/button';
import { Bell } from '@phosphor-icons/react';
import React from 'react';

function HeaderNotification() {
	return (
		<Button
			variant='ghost'
			size='icon'
			className='w-8 h-8'>
			<Bell size={16} />
		</Button>
	);
}

export default HeaderNotification;
