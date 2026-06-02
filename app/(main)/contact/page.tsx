import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, ExternalLink, Phone, Mail, Gift, Euro, CheckCircle } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import ContactForm from '@/components/ContactForm'
import ScheduleGrid from '@/components/ScheduleGrid'
import reader from '@/lib/reader'
import type { Horaire, Tarifs } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact & Inscription',
  description:
    'Contactez le Cercle d\'Échecs Spicéen pour rejoindre le club, poser une question ou obtenir des informations sur les séances et inscriptions.',
}

export default async function ContactPage() {
  const horairesData = await reader.singletons.horaires.read()
  const horaires: Horaire[] = (horairesData?.seances ?? []).map((s) => ({
    id: s.id,
    jour: s.jour,
    heure_debut: s.heure_debut,
    heure_fin: s.heure_fin,
    libelle: s.libelle ?? '',
    lieu: s.lieu,
  }))

  const tarifsData = await reader.singletons.tarifs.read()
  const tarifs: Tarifs | null = tarifsData
    ? {
        saison: tarifsData.saison,
        cotisation_adulte: tarifsData.cotisation_adulte ?? '—',
        cotisation_enfant: tarifsData.cotisation_enfant ?? '—',
        licence_ffe_incluse: tarifsData.licence_ffe_incluse ?? true,
        note: tarifsData.note ?? '',
      }
    : null

  const tarifAdulteConnu = tarifs?.cotisation_adulte && tarifs.cotisation_adulte !== '—'
  const tarifEnfantConnu = tarifs?.cotisation_enfant && tarifs.cotisation_enfant !== '—'

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            label="Contact"
            title="Prenez contact avec nous"
            subtitle="Une question, une envie de nous rejoindre ? Remplissez le formulaire ou venez directement lors d'une séance."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-club-dark mb-6">
                Envoyez-nous un message
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Infos pratiques */}
          <div className="flex flex-col gap-8">
            {/* Adresse + carte */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-club-dark mb-4">
                Où nous trouver ?
              </h2>
              <ul className="flex flex-col gap-3 mb-4">
                <li className="flex items-start gap-2 text-club-gray">
                  <MapPin size={18} className="text-club-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-club-dark">Salle de la Colonne</p>
                    <p className="text-sm">Les Epesses, 85420</p>
                  </div>
                </li>
                <li className="flex items-center gap-2 text-club-gray text-sm">
                  <Phone size={16} className="text-club-gold shrink-0" />
                  <a href="tel:0607733305" className="hover:text-club-dark transition-colors">
                    06 07 73 33 05
                  </a>
                </li>
                <li className="flex items-center gap-2 text-club-gray text-sm">
                  <Mail size={16} className="text-club-gold shrink-0" />
                  <a
                    href="mailto:cercledechecsSpiceen@gmail.com"
                    className="hover:text-club-dark transition-colors"
                  >
                    cercledechecsSpiceen@gmail.com
                  </a>
                </li>
              </ul>
              {/* Google Maps embed */}
              <div className="w-full h-52 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  title="Localisation de la Salle de la Colonne, Les Epesses"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2722.5!2d-1.0!3d46.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4804e5a7b2e91adb%3A0x0!2sSalle+de+la+Colonne%2C+Les+Epesses%2C+85420!5e0!3m2!1sfr!2sfr!4v1000000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Horaires */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-club-dark mb-4 flex items-center gap-2">
                <Clock size={20} className="text-club-gold" /> Horaires des séances
              </h2>
              {/* Séance d'essai */}
              <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800">
                <Gift size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-semibold text-sm">1ère séance offerte</p>
                  <p className="text-sm mt-0.5 text-amber-700">
                    Venez découvrir le club sans engagement — aucune inscription préalable nécessaire.
                  </p>
                </div>
              </div>
              <ScheduleGrid horaires={horaires} />
            </div>

            {/* Tarifs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold text-club-dark mb-4 flex items-center gap-2">
                <Euro size={18} className="text-club-gold" /> Tarifs {tarifs?.saison && <span className="text-club-gray font-sans text-sm font-normal">{tarifs.saison}</span>}
              </h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-club-gray">Adulte</span>
                  <span className="font-semibold text-club-dark">
                    {tarifAdulteConnu ? tarifs!.cotisation_adulte : <a href="tel:0607733305" className="text-club-gold hover:underline">Nous contacter</a>}
                  </span>
                </li>
                <li className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-club-gray">Enfant (−18 ans)</span>
                  <span className="font-semibold text-club-dark">
                    {tarifEnfantConnu ? tarifs!.cotisation_enfant : <a href="tel:0607733305" className="text-club-gold hover:underline">Nous contacter</a>}
                  </span>
                </li>
                {tarifs?.licence_ffe_incluse && (
                  <li className="flex items-center gap-2 text-green-700 text-xs">
                    <CheckCircle size={14} className="shrink-0" />
                    Licence FFE incluse dans la cotisation
                  </li>
                )}
              </ul>
              {tarifs?.note && (
                <p className="mt-3 text-xs text-club-gray">{tarifs.note}</p>
              )}
            </div>

            {/* Inscription HelloAsso */}
            <div className="bg-club-dark rounded-2xl p-6">
              <p className="text-white font-semibold mb-1">Inscription en ligne</p>
              <p className="text-gray-400 text-sm mb-4">
                Rejoignez le club et réglez votre licence directement en ligne via HelloAsso.
              </p>
              <Link
                href="https://www.helloasso.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-club-gold text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors text-sm"
              >
                S&apos;inscrire sur HelloAsso <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
