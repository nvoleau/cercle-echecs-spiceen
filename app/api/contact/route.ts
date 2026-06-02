import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter: max 3 requests per hour per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return false
  }

  if (entry.count >= 3) return true

  entry.count++
  return false
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Trop de messages envoyés. Veuillez réessayer dans une heure.' },
      { status: 429 }
    )
  }

  let body: { nom?: string; email?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const { nom, email, message } = body

  if (!nom || typeof nom !== 'string' || nom.trim().length < 2) {
    return NextResponse.json({ error: 'Nom invalide (minimum 2 caractères).' }, { status: 422 })
  }
  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 422 })
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return NextResponse.json({ error: 'Message trop court (minimum 10 caractères).' }, { status: 422 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL ?? 'cercledechecspiceen@gmail.com'

  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured')
    return NextResponse.json(
      { error: 'Le service d\'envoi d\'emails n\'est pas configuré.' },
      { status: 503 }
    )
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Site Web CES <noreply@cercle-echecs-spiceen.fr>',
      to: contactEmail,
      replyTo: email.trim(),
      subject: `[Contact CES] Message de ${nom.trim()}`,
      html: `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(nom.trim())}</p>
        <p><strong>Email :</strong> ${escapeHtml(email.trim())}</p>
        <hr />
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message.trim())}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
