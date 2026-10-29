import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { competitions } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'
import { getCompetitionsAdmin, getOrCreateSaisonId } from '@/lib/queries'

export async function GET(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rows = await getCompetitionsAdmin()
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const saison_id = await getOrCreateSaisonId(body.saison)
  const inserted = await db
    .insert(competitions)
    .values({
      saison_id,
      nom: body.nom,
      equipe: body.equipe,
      classement: body.classement || null,
    })
    .returning({ id: competitions.id })
  return NextResponse.json({ id: inserted[0].id }, { status: 201 })
}
