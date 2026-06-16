'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from './RichTextEditor'

type ArticleData = {
  id: number
  slug: string
  titre: string
  date: string
  resume: string
  image_couverture: string | null
  contenu: string
  publie: boolean
}

interface Props {
  article?: ArticleData
  initialContent?: string
}

export default function ArticleForm({ article, initialContent = '' }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [content, setContent] = useState(initialContent)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverUrl, setCoverUrl] = useState(article?.image_couverture ?? '')
  const isEdit = !!article

  async function uploadCover(file: File) {
    setCoverUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'articles/couvertures')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const { url } = await res.json()
      setCoverUrl(url)
    } finally {
      setCoverUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const g = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value
    const data = {
      titre: g('titre'),
      date: g('date'),
      resume: (form.elements.namedItem('resume') as HTMLTextAreaElement).value,
      image_couverture: coverUrl || null,
      contenu: content,
      publie: (form.elements.namedItem('publie') as HTMLInputElement).checked,
    }

    startTransition(async () => {
      const url = isEdit ? `/api/admin/articles/${article!.id}` : '/api/admin/articles'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Une erreur est survenue.')
      } else {
        router.push('/admin/articles')
        router.refresh()
      }
    })
  }

  async function handleDelete() {
    if (!article || !confirm('Supprimer cet article définitivement ?')) return
    startTransition(async () => {
      await fetch(`/api/admin/articles/${article.id}`, { method: 'DELETE' })
      router.push('/admin/articles')
      router.refresh()
    })
  }

  const labelCls = 'block text-sm font-medium text-club-dark mb-1'
  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-club-dark text-sm focus:outline-none focus:ring-2 focus:ring-club-gold'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <div>
        <label htmlFor="titre" className={labelCls}>Titre *</label>
        <input id="titre" name="titre" type="text" required defaultValue={article?.titre} className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className={labelCls}>Date de publication *</label>
          <input id="date" name="date" type="date" required defaultValue={article?.date} className={inputCls} />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input name="publie" type="checkbox" defaultChecked={article?.publie ?? true} className="w-4 h-4 accent-club-gold" />
            <span className="text-sm font-medium text-club-dark">Publié</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="resume" className={labelCls}>Résumé * <span className="text-club-gray font-normal">(2-3 phrases affichées en aperçu)</span></label>
        <textarea id="resume" name="resume" required rows={3} defaultValue={article?.resume} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Image de couverture</label>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://… ou /articles/…"
            className={`${inputCls} flex-1`}
          />
          <label className="shrink-0 cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-club-dark text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            {coverUploading ? 'Upload…' : 'Choisir une image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) uploadCover(e.target.files[0]) }}
            />
          </label>
        </div>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="Aperçu couverture" className="mt-3 h-32 w-auto rounded-lg object-cover border border-gray-200" />
        )}
      </div>

      <div>
        <label className={labelCls}>Contenu *</label>
        <RichTextEditor content={content} onChange={setContent} />
        <p className="mt-1.5 text-xs text-club-gray">
          Utilisez la barre d&apos;outils pour mettre en forme. Cliquez sur l&apos;icône image pour insérer une photo.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
        {isEdit ? (
          <button type="button" onClick={handleDelete} disabled={isPending} className="text-red-600 text-sm font-medium hover:underline disabled:opacity-50">
            Supprimer l&apos;article
          </button>
        ) : <span />}
        <button
          type="submit"
          disabled={isPending || coverUploading}
          className="bg-club-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Enregistrement…' : isEdit ? 'Enregistrer' : "Créer l'article"}
        </button>
      </div>
    </form>
  )
}
