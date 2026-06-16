import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { evenements } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function GET(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rows = await db.select().from(evenements)
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const id = `${slugify(body.titre)}-${body.date}`
  await db.insert(evenements).values({
    id,
    titre: body.titre,
    date: body.date,
    heure: body.heure,
    type: body.type,
    description: body.description,
    lieu: body.lieu,
    tarif: body.tarif || null,
    lien_inscription: body.lien_inscription || null,
    affiche: body.affiche || null,
  })
  return NextResponse.json({ id }, { status: 201 })
}
