import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

export async function POST(request: Request) {
  const secret = process.env.KEYSTATIC_SECRET
  const correctPassword = process.env.KEYSTATIC_PASSWORD

  if (!secret || !correctPassword) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
  }

  const body = await request.json()
  const enteredPassword = (body.password ?? '').trim()
  const expectedPassword = correctPassword.trim()

  if (enteredPassword !== expectedPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await computeToken(secret.trim(), expectedPassword)
  const cookieStore = await cookies()
  cookieStore.set('ks_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
