import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, ExternalLink } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import ContactForm from '@/components/ContactForm'
import ScheduleGrid from '@/components/ScheduleGrid'
import reader from '@/lib/reader'
import type { Horaire } from '@/lib/types'

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
              <div className="flex items-start gap-2 text-club-gray mb-4">
                <MapPin size={18} className="text-club-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-club-dark">Salle de la Colonne</p>
                  <p className="text-sm">Les Epesses, 85420</p>
                </div>
              </div>
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
              <ScheduleGrid horaires={horaires} />
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
