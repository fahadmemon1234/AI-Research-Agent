import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/terms',
  '/privacy',
  '/cookies',
  '/support',
  '/beta-access',
  '/pro-plan',
  '/security',
];

// Define routes that are completely public (even if authenticated)
const alwaysPublicRoutes = [
  '/auth/login',
  '/auth/register',
];

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('access_token')?.value;
  
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  );
  
  // Check if current path is always public (even for authenticated users)
  const isAlwaysPublicRoute = alwaysPublicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  );

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicRoute) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('return', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is authenticated and trying to access login/register pages, redirect to dashboard
  if (token && isAlwaysPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ],
};