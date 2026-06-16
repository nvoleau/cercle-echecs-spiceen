import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tarifs } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

export async function GET(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rows = await db.select().from(tarifs).where(eq(tarifs.id, 1))
  return NextResponse.json(rows[0] ?? null)
}

export async function PUT(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  await db.update(tarifs).set({
    saison: body.saison,
    cotisation_adulte: body.cotisation_adulte,
    cotisation_enfant: body.cotisation_enfant,
    licence_ffe_incluse: body.licence_ffe_incluse,
    note: body.note,
  }).where(eq(tarifs.id, 1))
  return NextResponse.json({ ok: true })
}
