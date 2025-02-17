import React from 'react';
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from '@/components/ui/tabs/tabs';

interface UnderLinedTabProps {
	tabs: { value: string; label: string; content: React.ReactNode }[];
	defaultValue?: string;
	className?: string;
}

function UnderLinedTab({ tabs, defaultValue, className }: UnderLinedTabProps) {
	return (
		<Tabs
			defaultValue={defaultValue || tabs[0].value}
			className={className}>
			<TabsList className='w-full h-auto bg-transparent justify-start gap-4 p-0'>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className='px-1 py-2 h-auto data-[state=active]:bg-transparent relative data-[state=active]:text-primary text-muted-foreground hover:text-primary transition-colors'>
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
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent
					key={tab.value}
					value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}

export default UnderLinedTab;
