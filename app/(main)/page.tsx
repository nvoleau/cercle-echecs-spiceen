import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Users, GraduationCap, Trophy, School, ArrowRight, Gift } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import ScheduleGrid from '@/components/ScheduleGrid'
import ArticleCard from '@/components/ArticleCard'
import EventCard from '@/components/EventCard'
import { getHoraires, getArticles, getEvenements } from '@/lib/queries'
import { isFutureEvent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export const metadata: Metadata = {
  title: 'Club d\'échecs aux Epesses, Vendée — Cercle d\'Échecs Spicéen',
  description:
    'Bienvenue au Cercle d\'Échecs Spicéen, club d\'échecs affilié FFE aux Epesses (Vendée, 85590). Séances tous niveaux chaque lundi et mercredi à 18h15. Première séance offerte, dès 8 ans.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Cercle d\'Échecs Spicéen — Club d\'échecs aux Epesses, Vendée',
    description:
      'Club d\'échecs affilié FFE aux Epesses (Vendée). Séances lundi et mercredi à 18h15. Tous niveaux, dès 8 ans. Première séance offerte.',
    url: siteUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Cercle d\'Échecs Spicéen — Club d\'échecs aux Epesses, Vendée',
      },
    ],
  },
}

const reasons = [
  {
    icon: Users,
    title: 'Une communauté soudée',
    text: 'Des licenciés qui se retrouvent chaque semaine dans une ambiance conviviale et bienveillante.',
  },
  {
    icon: GraduationCap,
    title: 'Des cours pour tous',
    text: 'Débutants ou confirmés, nos séances hebdomadaires permettent de progresser à son rythme avec l\'aide de joueurs expérimentés.',
  },
  {
    icon: Trophy,
    title: 'Des compétitions',
    text: 'Engagés en championnat départemental, tournois ouverts et blitz — pour vivre l\'échecs compétitif en Vendée.',
  },
  {
    icon: School,
    title: 'Ouverture scolaire',
    text: 'Le club accueille les jeunes dès 8 ans et collabore avec les établissements locaux pour initier les enfants aux échecs.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Où se situe le Cercle d\'Échecs Spicéen ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le club est situé à la Salle de la Colonne, aux Epesses (85590), en Vendée. Venez nous rendre visite lors d\'une séance, sans inscription préalable.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels sont les horaires des séances d\'échecs ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les séances ont lieu chaque lundi et chaque mercredi à 18h15, à la Salle de la Colonne aux Epesses (Vendée).',
      },
    },
    {
      '@type': 'Question',
      name: 'À partir de quel âge peut-on rejoindre le club ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le club accueille les joueurs dès 8 ans, tous niveaux confondus — des débutants complets aux joueurs classés.',
      },
    },
    {
      '@type': 'Question',
      name: 'La première séance est-elle gratuite ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, la première séance est entièrement offerte et sans inscription préalable. Venez découvrir le club librement !',
      },
    },
    {
      '@type': 'Question',
      name: 'Le club est-il affilié à la Fédération Française des Échecs ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, le Cercle d\'Échecs Spicéen est affilié à la Fédération Française des Échecs (FFE). Le club participe au championnat départemental de Vendée et à des tournois ouverts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment s\'inscrire au Cercle d\'Échecs Spicéen ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'L\'inscription se fait en ligne via HelloAsso ou directement en venant lors d\'une séance. Vous pouvez aussi nous contacter par email à cercledechecspiceen@gmail.com ou par téléphone au 06 07 73 33 05.',
      },
    },
  ],
}

const faqItems = [
  { q: 'Quand ont lieu les séances ?', a: 'Chaque lundi et mercredi à 18h15, à la Salle de la Colonne, Les Epesses.' },
  { q: 'À partir de quel âge ?', a: 'Dès 8 ans, tous niveaux — débutants comme joueurs classés.' },
  { q: 'La première séance est-elle payante ?', a: 'Non, la première séance est offerte, sans inscription préalable.' },
  { q: 'Comment s\'inscrire ?', a: 'En ligne via HelloAsso ou en venant directement lors d\'une séance.' },
]

export default async function HomePage() {
  const horaires = await getHoraires()

  const latestArticles = (await getArticles()).slice(0, 3)

  const upcomingEvents = (await getEvenements())
    .filter((e) => isFutureEvent(e.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero */}
      <section className="relative bg-club-dark overflow-hidden min-h-[80vh] flex items-center">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url('/pawn-pattern.svg')", backgroundSize: '80px 80px' }}
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Logo mis en avant */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-club-gold/20 blur-2xl scale-125" aria-hidden="true" />
              <Image
                src="/logo.png"
                alt="Logo Cercle d'Échecs Spicéen"
                width={140}
                height={140}
                className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full ring-4 ring-club-gold/60 shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Nom du club — identité de marque */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
            <span className="text-club-gold">Cercle d&apos;échecs Spicéen</span>
          </h1>
          <p className="text-gray-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6">
            Convivial par nature, ambitieux par passion !
          </p>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Club d&apos;échecs affilié à la FFE, aux Epesses (Vendée). Séances ouvertes à tous les niveaux chaque lundi et mercredi à 18h15.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-club-gold text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors text-base">
              Nous contacter
            </Link>
            <Link href="/evenements" className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-club-dark transition-colors text-base">
              Voir nos événements
            </Link>
          </div>
        </div>
      </section>

      {/* Notre club */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                label="Notre club"
                title="Une passion partagée, une famille"
                subtitle="Le Cercle d'Échecs Spicéen réunit passionnés d'échecs de tous âges et tous niveaux. Notre ambition : offrir un cadre sérieux et convivial pour progresser et représenter les Epesses dans les compétitions vendéennes."
              />
              <div className="mt-8 flex flex-col gap-4">
                {[
                  'Affilié à la Fédération Française des Échecs (FFE)',
                  'Plus de 15 licenciés, des débutants aux classés',
                  'Salle de la Colonne, Les Epesses (85590)',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3 text-club-gray text-sm">
                    <span className="w-2 h-2 rounded-full bg-club-gold shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-club-gold font-semibold hover:gap-3 transition-all text-sm">
                Rejoindre le club <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/club.jpg"
                alt="Séance au Cercle d'Échecs Spicéen"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 raisons */}
      <section className="py-20 bg-club-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader label="Pourquoi nous rejoindre" title="4 raisons de jouer aux Epesses" light centered />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason) => {
              const Icon = reason.icon
              return (
                <div key={reason.title} className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-club-card flex items-center justify-center">
                    <Icon size={22} className="text-club-gold" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-club-dark">{reason.title}</h3>
                  <p className="text-club-gray text-sm leading-relaxed">{reason.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Horaires */}
      <section className="py-20 bg-white" id="horaires">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionHeader
              label="Pratique"
              title="Nos horaires de séances"
              subtitle="Deux créneaux hebdomadaires ouverts à tous. Pas besoin de vous inscrire pour votre première venue — venez simplement !"
              centered
            />
          </div>
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-amber-800">
            <Gift size={20} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold text-sm">1ère séance offerte</p>
              <p className="text-sm mt-0.5 text-amber-700">Venez découvrir le club sans engagement — aucune inscription préalable nécessaire.</p>
            </div>
          </div>
          <ScheduleGrid horaires={horaires} />
        </div>
      </section>

      {/* Actualités — événements à venir et articles, affichés seulement si l'un des deux existe */}
      {(upcomingEvents.length > 0 || latestArticles.length > 0) && (
        <section className="py-20 bg-club-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
            {upcomingEvents.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-10">
                  <SectionHeader
                    label="Actualités"
                    title="Prochains événements"
                  />
                  <Link
                    href="/evenements"
                    className="hidden sm:inline-flex items-center gap-2 text-club-gold text-sm font-semibold hover:gap-3 transition-all"
                  >
                    Tout l&apos;agenda <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="mt-8 text-center sm:hidden">
                  <Link href="/evenements" className="inline-flex items-center gap-2 text-club-gold text-sm font-semibold">
                    Tout l&apos;agenda <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}

            {latestArticles.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-10">
                  <SectionHeader
                    label={upcomingEvents.length === 0 ? 'Actualités' : undefined}
                    title="Derniers articles"
                  />
                  <Link
                    href="/blog"
                    className="hidden sm:inline-flex items-center gap-2 text-club-gold text-sm font-semibold hover:gap-3 transition-all"
                  >
                    Tous les articles <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
                <div className="mt-8 text-center sm:hidden">
                  <Link href="/blog" className="inline-flex items-center gap-2 text-club-gold text-sm font-semibold">
                    Tous les articles <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionHeader label="Questions fréquentes" title="Tout ce qu'il faut savoir" centered />
          </div>
          <dl className="flex flex-col gap-4">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-gray-200 px-6 py-5">
                <dt className="font-semibold text-club-dark mb-1">{item.q}</dt>
                <dd className="text-club-gray text-sm leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-club-gold py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Prêt à déplacer vos pièces ?</h2>
          <p className="text-amber-100 mb-8">Venez nous rencontrer lors d&apos;une séance — la première est offerte, sans inscription préalable.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-white text-club-gold font-semibold rounded-lg hover:bg-amber-50 transition-colors">
              Nous contacter
            </Link>
            <Link href="/evenements" className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-amber-600 transition-colors">
              Voir les événements
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
