import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_CHAINS } from './constant/config/core.constant';
import { LOCAL_ROUTE } from './constant/routes/routes.constant';

export function middleware(request: NextRequest) {
	// Only redirect if the path is exactly the root
	if (request.nextUrl.pathname === '/') {
		// Get the first supported chain from the array
		const [firstChain] = SUPPORTED_CHAINS;

		// Create the new URL with the first chain as the path
		const url = new URL(
			`/${firstChain}` + LOCAL_ROUTE.EARN.HOME,
			request.url
		);

		// Return a redirect response
		return NextResponse.redirect(url);
	}

	// For all other paths, continue with the request
	return NextResponse.next();
}

// Configure the middleware to only run on the homepage
export const config = {
	matcher: '/',
};
