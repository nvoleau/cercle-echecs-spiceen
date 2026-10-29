import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { competitions, matchs } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'
import { getOrCreateSaisonId } from '@/lib/queries'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const saison_id = await getOrCreateSaisonId(body.saison)
  await db
    .update(competitions)
    .set({
      saison_id,
      nom: body.nom,
      equipe: body.equipe,
      classement: body.classement || null,
    })
    .where(eq(competitions.id, Number(id)))
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await db.delete(matchs).where(eq(matchs.competition_id, Number(id)))
  await db.delete(competitions).where(eq(competitions.id, Number(id)))
  return NextResponse.json({ ok: true })
}
