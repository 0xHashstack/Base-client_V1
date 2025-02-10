import React from 'react';

interface IfProps {
	isTrue: boolean | string | number | null | undefined;
	children: React.ReactNode;
}

function If({ isTrue, children }: IfProps) {
	const [trueChild, falseChild = null] = React.Children.toArray(children);
	return isTrue ? trueChild : falseChild;
}

export default If;
