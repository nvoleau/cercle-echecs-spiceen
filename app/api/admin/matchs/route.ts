import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { matchs } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const inserted = await db
    .insert(matchs)
    .values({
      competition_id: body.competition_id,
      adversaire: body.adversaire,
      domicile: body.domicile,
      score_nous: body.score_nous,
      score_eux: body.score_eux,
      resultat: body.resultat,
    })
    .returning({ id: matchs.id })
  return NextResponse.json({ id: inserted[0].id }, { status: 201 })
}
