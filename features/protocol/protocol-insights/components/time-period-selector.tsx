import React from 'react';

export type TimePeriod = '1D' | '1W' | '1M' | 'All';

interface TimePeriodSelectorProps {
	selectedPeriod: TimePeriod;
	onChange: (period: TimePeriod) => void;
	className?: string;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
	selectedPeriod,
	onChange,
	className = '',
}) => {
	const periods: TimePeriod[] = ['1D', '1W', '1M', 'All'];

	return (
		<div className={`flex rounded-full bg-muted/20 p-1 ${className}`}>
			{periods.map((period) => (
				<button
					key={period}
					className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
						selectedPeriod === period ?
							'bg-white text-primary-foreground'
						:	'text-muted-foreground hover:bg-muted/50'
					}`}
					onClick={() => onChange(period)}>
					{period}
				</button>
			))}
		</div>
	);
};

export default TimePeriodSelector;
