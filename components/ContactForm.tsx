'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface FormState {
  nom: string
  email: string
  message: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ nom: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ nom: '', email: '', message: '' })
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Impossible de contacter le serveur. Vérifiez votre connexion.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle size={48} className="text-green-500" />
        <h3 className="font-serif text-xl font-bold text-club-dark">Message envoyé !</h3>
        <p className="text-club-gray">
          Nous vous répondrons dans les plus brefs délais.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm text-club-gold hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-club-dark mb-1">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          autoComplete="name"
          value={form.nom}
          onChange={handleChange}
          placeholder="Jean Dupont"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-club-dark focus:outline-none focus:ring-2 focus:ring-club-gold focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-club-dark mb-1">
          Adresse email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="jean.dupont@exemple.fr"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-club-dark focus:outline-none focus:ring-2 focus:ring-club-gold focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-club-dark mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Votre message..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-club-dark focus:outline-none focus:ring-2 focus:ring-club-gold focus:border-transparent transition resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-club-gold text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi en cours…
          </>
        ) : (
          <>
            <Send size={16} />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  )
}
