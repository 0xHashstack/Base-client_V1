import Link, { LinkProps } from 'next/link';
import { useWeb3Store } from '@/store/useWeb3.store';

type InternalLinkProps = Omit<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof LinkProps
> &
	LinkProps & {
		children?: React.ReactNode | undefined;
	} & React.RefAttributes<HTMLAnchorElement>;

type DashboardLinkProps = Omit<InternalLinkProps, 'href'> & {
	href: string;
};

export default function DashboardLink({ href, ...props }: DashboardLinkProps) {
	const { selectedChain } = useWeb3Store();

	const chainHref = `/${selectedChain}${href.startsWith('/') ? href : `/${href}`}`;

	return (
		<Link
			href={chainHref}
			{...props}
		/>
	);
}
