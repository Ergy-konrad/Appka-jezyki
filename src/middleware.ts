import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/login', '/register', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and static files
  if (publicPaths.some(p => pathname === p || pathname.startsWith('/api'))) {
    return NextResponse.next()
  }

  // Check for Supabase auth cookies OR guest mode cookie
  const hasAuthCookie = request.cookies.getAll().some(
    cookie => cookie.name.startsWith('sb-')
  )
  const isGuest = request.cookies.get('lingua_guest')?.value === 'true'

  // If logged in via Supabase OR guest mode, allow access
  if (hasAuthCookie || isGuest) {
    return NextResponse.next()
  }

  // Not authenticated - redirect to login
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json|icon-192.png|icon-512.png).*)',
  ],
}
