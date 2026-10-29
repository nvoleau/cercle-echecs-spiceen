import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { matchs } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  await db
    .update(matchs)
    .set({
      adversaire: body.adversaire,
      domicile: body.domicile,
      score_nous: body.score_nous,
      score_eux: body.score_eux,
      resultat: body.resultat,
    })
    .where(eq(matchs.id, Number(id)))
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await db.delete(matchs).where(eq(matchs.id, Number(id)))
  return NextResponse.json({ ok: true })
}
