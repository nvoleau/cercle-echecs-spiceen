import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'ks_session'

async function computeToken(secret: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(password))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  const secret = process.env.KEYSTATIC_SECRET
  const password = process.env.KEYSTATIC_PASSWORD

  // Si les variables ne sont pas configurées, accès libre (dev local sans env)
  if (!secret || !password) return NextResponse.next()

  const cookieToken = request.cookies.get(AUTH_COOKIE)?.value
  const expectedToken = await computeToken(secret, password)

  if (cookieToken !== expectedToken) {
    const loginUrl = new URL('/keystatic-login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/keystatic((?!/github-login).*)',
    '/api/keystatic((?!/github).*)',
  ],
}
