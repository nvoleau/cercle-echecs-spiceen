import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { articles } from '@/lib/schema'
import { checkAdminRequest } from '@/lib/admin-auth'

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

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Params) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const { titre, date, resume, image_couverture, contenu, publie } = body
  const slug = slugify(titre)
  const [row] = await db
    .update(articles)
    .set({ slug, titre, date, resume, image_couverture: image_couverture ?? null, contenu, publie })
    .where(eq(articles.id, parseInt(id)))
    .returning()
  if (!row) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(request: Request, { params }: Params) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const { id } = await params
  await db.delete(articles).where(eq(articles.id, parseInt(id)))
  return NextResponse.json({ ok: true })
}
