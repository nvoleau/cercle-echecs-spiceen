import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Users, GraduationCap, Trophy, School, ArrowRight, Gift } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import ScheduleGrid from '@/components/ScheduleGrid'
import ArticleCard from '@/components/ArticleCard'
import reader from '@/lib/reader'
import type { Horaire, Article } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Accueil — Club d\'échecs aux Epesses, Vendée',
  description:
    'Bienvenue au Cercle d\'Échecs Spicéen, club d\'échecs affilié FFE basé aux Epesses (Vendée). Rejoignez-nous chaque lundi et mercredi à 18h15.',
}

const reasons = [
  {
    icon: Users,
    title: 'Une communauté soudée',
    text: 'Moins de 30 licenciés qui se retrouvent chaque semaine dans une ambiance conviviale et bienveillante.',
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
    text: 'Le club accueille les jeunes dès 8 ans et collabore avec les établissements locaux pour initier les enfants.',
  },
]

export default async function HomePage() {
  const horairesData = await reader.singletons.horaires.read()
  const horaires: Horaire[] = (horairesData?.seances ?? []).map((s) => ({
    id: s.id,
    jour: s.jour,
    heure_debut: s.heure_debut,
    heure_fin: s.heure_fin,
    libelle: s.libelle ?? '',
    lieu: s.lieu,
  }))

  const rawArticles = await reader.collections.articles.all()
  const latestArticles: Article[] = rawArticles
    .map((a) => ({
      slug: a.slug,
      titre: a.entry.titre,
      date: a.entry.date ?? '',
      resume: a.entry.resume ?? '',
      image_couverture: a.entry.image_couverture ?? null,
    }))
    .filter((a) => a.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <>
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
            Cercle d&apos;Échecs<br />
            <span className="text-club-gold">Spicéen</span>
          </h1>
          <p className="text-gray-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6">
            Jouez · Progressez · Compétez
          </p>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Club d&apos;échecs affilié à la FFE, basé aux Epesses (Vendée). Séances ouvertes à tous les niveaux chaque lundi et mercredi à 18h15.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-club-gold text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors text-base">
              Nous rejoindre
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
                  'Moins de 30 licenciés, des débutants aux classés',
                  'Basé à la Salle de la Colonne, Les Epesses (85420)',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3 text-club-gray text-sm">
                    <span className="w-2 h-2 rounded-full bg-club-gold shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-club-gold font-semibold hover:gap-3 transition-all text-sm">
                Rejoindre le club <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-club-card flex items-center justify-center border-2 border-dashed border-gray-200">
              <div className="text-center p-8">
                <Image src="/logo.svg" alt="Cercle d'Échecs Spicéen" width={80} height={80} className="mx-auto mb-4 opacity-40" />
                <p className="text-gray-400 text-sm">Photo du club à venir</p>
              </div>
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

      {/* Blog — affiché seulement si des articles existent */}
      {latestArticles.length > 0 && (
        <section className="py-20 bg-club-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                label="Actualités"
                title="Derniers articles"
              />
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-club-gold text-sm font-semibold hover:gap-3 transition-all"
              >
                Tous les articles <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/blog" className="inline-flex items-center gap-2 text-club-gold text-sm font-semibold">
                Tous les articles <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-club-gold py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Prêt à déplacer vos pièces ?</h2>
          <p className="text-amber-100 mb-8">Venez nous rencontrer lors d&apos;une séance ou contactez-nous pour plus d&apos;informations.</p>
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
