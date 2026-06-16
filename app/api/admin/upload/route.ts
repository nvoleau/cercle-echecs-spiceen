import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { checkAdminRequest } from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!(await checkAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get('file') as File | null
  const folder = (form.get('folder') as string) || 'uploads'

  if (!file || !file.size) {
    return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const name = `${folder}/${Date.now()}.${ext}`

  try {
    const blob = await put(name, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Upload échoué : ${message}` }, { status: 500 })
  }
}
