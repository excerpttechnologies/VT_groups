import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_dev_only'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Paths that don't require authentication
  const isPublicPath = 
    pathname === '/' || 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname.startsWith('/api/auth') ||
    pathname.includes('/api/seed');

  if (!token) {
    if (isPublicPath) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload }: any = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role;

    // Protect Admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Protect Employee routes
    if (pathname.startsWith('/employee')) {
      if (userRole !== 'admin' && userRole !== 'employee') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Protect Customer routes
    if (pathname.startsWith('/customer')) {
      if (userRole !== 'admin' && userRole !== 'employee' && userRole !== 'customer') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname === '/login' || pathname === '/register') {
      if (userRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
      if (userRole === 'employee') return NextResponse.redirect(new URL('/employee', request.url));
      return NextResponse.redirect(new URL('/customer', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    if (!isPublicPath) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
