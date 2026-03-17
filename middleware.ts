import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_dev_only'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ STEP 1: Allow static files and Next.js internals (FIRST CHECK)
  // Files with extensions like .png, .jpg, .css, .js, .svg, .ico, .woff, etc.
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Always allow Next.js internal routes
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // ✅ STEP 2: Public routes that don't need authentication
  const isPublicPath = 
    pathname === '/' || 
    pathname === '/login' || 
    pathname === '/register';

  // ✅ STEP 3: API routes (seed, auth routes)
  const isPublicAPI = 
    pathname.startsWith('/api/auth') ||
    pathname.includes('/api/seed');

  if (isPublicPath || isPublicAPI) {
    return NextResponse.next();
  }

  // ✅ STEP 4: Check authentication
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Not authenticated - redirect to login (except for public paths we already handled)
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ STEP 5: Verify token and check role-based access
  try {
    const decoded = await jwtVerify(token, JWT_SECRET);
    if (!decoded || !decoded.payload) {
      console.error('[Middleware] JWT verification returned empty payload');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const { payload }: any = decoded;
    const userRole = payload.role;

    // Protect Admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Protect Employee routes
    if (pathname.startsWith('/employee')) {
      if (userRole !== 'admin' && userRole !== 'employee') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Protect Customer routes
    if (pathname.startsWith('/customer')) {
      if (userRole !== 'admin' && userRole !== 'employee' && userRole !== 'customer') {
        return NextResponse.redirect(new URL('/', request.url));
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
    console.error('[Auth] Token verification failed:', error);
    // Invalid token - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

/**
 * MATCHER CONFIGURATION
 * 
 * Only run middleware on routes that need protection.
 * Static files and Next.js internals are excluded here for better performance.
 * 
 * Simplified matcher that works reliably with Next.js 16+
 */
export const config = {
  matcher: [
    // Match app routes, API routes, but exclude:
    // - Static files (handled by the pathname.includes('.') check in middleware)
    // - Next.js internals (handled by the pathname.startsWith('/_next/') check)
    // - Favicon (handled by explicit check)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
