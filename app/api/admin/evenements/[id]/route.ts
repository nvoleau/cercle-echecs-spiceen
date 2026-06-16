import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { evenements } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  await db.update(evenements).set({
    titre: body.titre,
    date: body.date,
    heure: body.heure,
    type: body.type,
    description: body.description,
    lieu: body.lieu,
    tarif: body.tarif || null,
    lien_inscription: body.lien_inscription || null,
    affiche: body.affiche || null,
  }).where(eq(evenements.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await db.delete(evenements).where(eq(evenements.id, id))
  return NextResponse.json({ ok: true })
}
