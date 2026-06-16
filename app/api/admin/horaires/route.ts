import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { horaires } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

export async function GET(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rows = await db.select().from(horaires)
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  await db.insert(horaires).values({
    id: body.id,
    jour: body.jour,
    heure_debut: body.heure_debut,
    heure_fin: body.heure_fin,
    libelle: body.libelle,
    lieu: body.lieu,
  })
  return NextResponse.json({ id: body.id }, { status: 201 })
}
