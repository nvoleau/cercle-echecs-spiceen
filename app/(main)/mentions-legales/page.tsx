import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du Cercle d\'Échecs Spicéen, club d\'échecs aux Epesses (Vendée).',
  robots: { index: false },
}

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-3xl font-bold text-club-dark mb-10">Mentions légales</h1>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Éditeur du site</h2>
        <p className="text-club-gray leading-relaxed">
          <strong className="text-club-dark">Cercle d&apos;Échecs Spicéen</strong><br />
          Association loi 1901 déclarée en préfecture<br />
          Numéro RNA : W852014120<br />
          Siège social : Salle de la Colonne, Les Epesses, 85590 Vendée<br />
          Email : <a href="mailto:cercledechecspiceen@gmail.com" className="text-club-gold hover:underline">cercledechecspiceen@gmail.com</a><br />
          Téléphone : <a href="tel:0607733305" className="text-club-gold hover:underline">06 07 73 33 05</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Responsable de publication</h2>
        <p className="text-club-gray leading-relaxed">
          Jérémy Léger, président du Cercle d&apos;Échecs Spicéen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Hébergement</h2>
        <p className="text-club-gray leading-relaxed">
          Ce site est hébergé par :<br />
          <strong className="text-club-dark">Vercel Inc.</strong><br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-club-gold hover:underline">https://vercel.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Propriété intellectuelle</h2>
        <p className="text-club-gray leading-relaxed">
          L&apos;ensemble des contenus présents sur ce site (textes, images, logo) sont la propriété du Cercle d&apos;Échecs Spicéen ou de leurs auteurs respectifs. Toute reproduction, même partielle, est interdite sans autorisation préalable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Données personnelles</h2>
        <p className="text-club-gray leading-relaxed">
          Pour toute information sur le traitement de vos données personnelles, consultez notre{' '}
          <a href="/politique-confidentialite" className="text-club-gold hover:underline">politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Cookies</h2>
        <p className="text-club-gray leading-relaxed">
          Ce site n&apos;utilise pas de cookies à des fins publicitaires ou de suivi. Des cookies techniques peuvent être déposés par l&apos;hébergeur Vercel pour assurer le bon fonctionnement du site.
        </p>
      </section>
    </div>
  )
}
