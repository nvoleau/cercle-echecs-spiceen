import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { horaires } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  await db.update(horaires).set({
    jour: body.jour,
    heure_debut: body.heure_debut,
    heure_fin: body.heure_fin,
    libelle: body.libelle,
    lieu: body.lieu,
  }).where(eq(horaires.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await db.delete(horaires).where(eq(horaires.id, id))
  return NextResponse.json({ ok: true })
}
