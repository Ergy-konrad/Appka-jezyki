import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pages that don't require auth
const publicPaths = ['/', '/login', '/register', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(p => pathname === p || pathname.startsWith('/api'))) {
    return NextResponse.next()
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    // No Supabase = guest mode, allow everything
    return NextResponse.next()
  }

  // Check for Supabase auth cookies
  const hasAuthCookie = request.cookies.getAll().some(
    cookie => cookie.name.startsWith('sb-') && cookie.name.includes('auth')
  )

  if (!hasAuthCookie) {
    // No auth cookie - check if there's any supabase session cookie
    const hasAnyCookie = request.cookies.getAll().some(
      cookie => cookie.name.startsWith('sb-')
    )

    if (!hasAnyCookie) {
      // No Supabase cookies at all = not logged in
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json|icon-192.png|icon-512.png).*)',
  ],
}
