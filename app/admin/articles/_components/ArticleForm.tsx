'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

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

export default function ArticleForm({ article }: { article?: ArticleData }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const isEdit = !!article

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const data = {
      titre: (form.elements.namedItem('titre') as HTMLInputElement).value,
      date: (form.elements.namedItem('date') as HTMLInputElement).value,
      resume: (form.elements.namedItem('resume') as HTMLTextAreaElement).value,
      image_couverture: (form.elements.namedItem('image_couverture') as HTMLInputElement).value || null,
      contenu: (form.elements.namedItem('contenu') as HTMLTextAreaElement).value,
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
            <input
              name="publie"
              type="checkbox"
              defaultChecked={article?.publie ?? true}
              className="w-4 h-4 accent-club-gold"
            />
            <span className="text-sm font-medium text-club-dark">Publié</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="resume" className={labelCls}>Résumé * <span className="text-club-gray font-normal">(2-3 phrases)</span></label>
        <textarea id="resume" name="resume" required rows={3} defaultValue={article?.resume} className={inputCls} />
      </div>

      <div>
        <label htmlFor="image_couverture" className={labelCls}>Image de couverture <span className="text-club-gray font-normal">(chemin /articles/…)</span></label>
        <input id="image_couverture" name="image_couverture" type="text" placeholder="/articles/mon-article/couverture.jpg" defaultValue={article?.image_couverture ?? ''} className={inputCls} />
      </div>

      <div>
        <label htmlFor="contenu" className={labelCls}>
          Contenu <span className="text-club-gray font-normal">(Markdown)</span>
        </label>
        <textarea
          id="contenu"
          name="contenu"
          rows={20}
          defaultValue={article?.contenu}
          className={`${inputCls} font-mono text-xs leading-relaxed`}
          placeholder={'# Titre\n\nVotre contenu en **Markdown**...\n\n![Alt texte](/articles/mon-article/image.jpg)'}
        />
        <p className="mt-1.5 text-xs text-club-gray">
          Supporte Markdown : **gras**, *italique*, # Titres, - Listes, ![image](url), [lien](url)
        </p>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 text-sm font-medium hover:underline disabled:opacity-50"
          >
            Supprimer l&apos;article
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-club-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer l\'article'}
        </button>
      </div>
    </form>
  )
}
