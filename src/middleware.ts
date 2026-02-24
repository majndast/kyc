import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/navigation'

const intlMiddleware = createMiddleware(routing)

// Routes that require authentication
const protectedRoutes = ['/profile']

// Routes that should redirect to /learn if already authenticated
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  // First, handle the intl middleware
  const response = intlMiddleware(request)

  // Get the pathname without locale
  const pathname = request.nextUrl.pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(cs|en)/, '')

  // Check if this is a protected or auth route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )

  // If not a protected or auth route, just return the intl response
  if (!isProtectedRoute && !isAuthRoute) {
    return response
  }

  // Create Supabase client for auth checking
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Extract locale from pathname
  const locale = pathname.match(/^\/(cs|en)/)?.[1] || 'cs'

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to learn if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}/learn`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/(cs|en)/:path*'],
}
