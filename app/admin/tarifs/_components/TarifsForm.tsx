'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type TarifsData = {
  saison: string
  cotisation_adulte: string
  cotisation_enfant: string
  licence_ffe_incluse: boolean
  note: string
}

export default function TarifsForm({ tarifs }: { tarifs: TarifsData }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const form = e.currentTarget
    const g = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value
    const data = {
      saison: g('saison'),
      cotisation_adulte: g('cotisation_adulte'),
      cotisation_enfant: g('cotisation_enfant'),
      licence_ffe_incluse: (form.elements.namedItem('licence_ffe_incluse') as HTMLInputElement).checked,
      note: (form.elements.namedItem('note') as HTMLTextAreaElement).value,
    }

    startTransition(async () => {
      const res = await fetch('/api/admin/tarifs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Une erreur est survenue.')
      } else {
        setSuccess(true)
        router.refresh()
      }
    })
  }

  const labelCls = 'block text-sm font-medium text-club-dark mb-1'
  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-club-dark text-sm focus:outline-none focus:ring-2 focus:ring-club-gold'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <div>
        <label htmlFor="saison" className={labelCls}>Saison *</label>
        <input id="saison" name="saison" type="text" required placeholder="2025-2026" defaultValue={tarifs.saison} className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cotisation_adulte" className={labelCls}>Cotisation adulte *</label>
          <input id="cotisation_adulte" name="cotisation_adulte" type="text" required placeholder="80 €" defaultValue={tarifs.cotisation_adulte} className={inputCls} />
        </div>
        <div>
          <label htmlFor="cotisation_enfant" className={labelCls}>Cotisation enfant *</label>
          <input id="cotisation_enfant" name="cotisation_enfant" type="text" required placeholder="50 €" defaultValue={tarifs.cotisation_enfant} className={inputCls} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="licence_ffe_incluse"
          name="licence_ffe_incluse"
          type="checkbox"
          defaultChecked={tarifs.licence_ffe_incluse}
          className="w-4 h-4 accent-club-gold"
        />
        <label htmlFor="licence_ffe_incluse" className="text-sm font-medium text-club-dark cursor-pointer">
          Licence FFE incluse dans la cotisation
        </label>
      </div>

      <div>
        <label htmlFor="note" className={labelCls}>Note <span className="text-club-gray font-normal">(optionnel)</span></label>
        <textarea id="note" name="note" rows={3} defaultValue={tarifs.note} placeholder="Informations complémentaires…" className={inputCls} />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 rounded-lg px-4 py-3">Tarifs enregistrés avec succès.</p>}

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="bg-club-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
