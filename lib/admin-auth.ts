import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

export async function requireAdmin(redirectTo = '/admin') {
  const secret = process.env.KEYSTATIC_SECRET
  const password = process.env.KEYSTATIC_PASSWORD
  if (!secret || !password) return // dev sans env vars → accès libre

  const cookieStore = await cookies()
  const token = cookieStore.get('ks_session')?.value
  const expected = await computeToken(secret, password)
  if (token !== expected) {
    redirect(`/keystatic-login?next=${redirectTo}`)
  }
}

export async function checkAdminRequest(request: Request): Promise<boolean> {
  const secret = process.env.KEYSTATIC_SECRET
  const password = process.env.KEYSTATIC_PASSWORD
  if (!secret || !password) return true

  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader.match(/ks_session=([^;]+)/)
  const token = match?.[1]
  const expected = await computeToken(secret, password)
  return token === expected
}
