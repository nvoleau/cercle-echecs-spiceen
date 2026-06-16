import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { articles } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'
import { desc } from 'drizzle-orm'

function slugify(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export async function GET(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const rows = await db.select().from(articles).orderBy(desc(articles.date))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const body = await request.json()
  const { titre, date, resume, image_couverture, contenu, publie } = body
  if (!titre || !date) {
    return NextResponse.json({ error: 'titre et date sont requis' }, { status: 400 })
  }
  const slug = slugify(titre)
  const [row] = await db.insert(articles).values({ slug, titre, date, resume: resume ?? '', image_couverture: image_couverture ?? null, contenu: contenu ?? '', publie: publie ?? true }).returning()
  return NextResponse.json(row, { status: 201 })
}
