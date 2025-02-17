import React from 'react';
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from '@/components/ui/tabs/tabs';
import { cn } from '@/lib/utils';

interface UnderLinedTabProps {
	tabs: { value: string; label: string; content: React.ReactNode }[];
	defaultValue?: string;
	className?: string;
}

function UnderLinedTab({ tabs, defaultValue, className }: UnderLinedTabProps) {
	return (
		<Tabs
			defaultValue={defaultValue || tabs[0].value}
			className={cn('flex flex-col', className)}>
			<TabsList className='w-full h-auto bg-transparent justify-start gap-8 p-0 border-b rounded-none'>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className='group px-0 py-2 h-auto data-[state=active]:bg-transparent relative data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-colors'>
						<span className='relative'>
							{tab.label}
							<span
								className='absolute -bottom-2 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform data-[state=active]:scale-x-100'
								data-state={
									tab.value === defaultValue ?
										'active'
									:	'inactive'
								}
							/>
						</span>

						<div
							className={
								'absolute -bottom-[1.5px] left-0 h-[2px] w-8 bg-primary transition-opacity opacity-0 group-data-[state=active]:opacity-100'
							}
							style={{ width: 'max(50%, 32px)' }}
						/>
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent
					key={tab.value}
					value={tab.value}
					className='mt-0'>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}

export default UnderLinedTab;
