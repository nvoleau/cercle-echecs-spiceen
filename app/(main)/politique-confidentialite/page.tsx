import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles du Cercle d\'Échecs Spicéen.',
  robots: { index: false },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-3xl font-bold text-club-dark mb-2">Politique de confidentialité</h1>
      <p className="text-club-gray text-sm mb-10">Dernière mise à jour : juin 2026</p>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Responsable du traitement</h2>
        <p className="text-club-gray leading-relaxed">
          <strong className="text-club-dark">Cercle d'Échecs Spicéen</strong><br />
          Salle de la Colonne, Les Epesses, 85590 Vendée<br />
          Email : <a href="mailto:cercledechecspiceen@gmail.com" className="text-club-gold hover:underline">cercledechecspiceen@gmail.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Données collectées</h2>
        <p className="text-club-gray leading-relaxed mb-3">
          Le seul formulaire de collecte de données présent sur ce site est le <strong className="text-club-dark">formulaire de contact</strong>. Les données collectées sont :
        </p>
        <ul className="list-disc list-inside text-club-gray space-y-1 pl-2">
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Contenu du message</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Finalité du traitement</h2>
        <p className="text-club-gray leading-relaxed">
          Ces données sont collectées uniquement pour répondre à votre demande de contact ou d'inscription au club. Elles ne sont pas utilisées à des fins commerciales ou publicitaires.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Base légale</h2>
        <p className="text-club-gray leading-relaxed">
          Le traitement repose sur votre consentement (article 6.1.a du RGPD), exprimé lors de l'envoi du formulaire.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Destinataires des données</h2>
        <p className="text-club-gray leading-relaxed">
          Les messages sont transmis par email au responsable du club via le service <strong className="text-club-dark">Resend</strong> (resend.com). Aucune donnée n'est revendue ou transmise à des tiers à des fins commerciales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Durée de conservation</h2>
        <p className="text-club-gray leading-relaxed">
          Les données sont conservées le temps nécessaire au traitement de votre demande, et au maximum 12 mois.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Vos droits</h2>
        <p className="text-club-gray leading-relaxed mb-3">
          Conformément au RGPD, vous disposez des droits suivants sur vos données :
        </p>
        <ul className="list-disc list-inside text-club-gray space-y-1 pl-2">
          <li>Droit d'accès</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d'opposition</li>
        </ul>
        <p className="text-club-gray leading-relaxed mt-3">
          Pour exercer ces droits, contactez-nous à :{' '}
          <a href="mailto:cercledechecspiceen@gmail.com" className="text-club-gold hover:underline">cercledechecspiceen@gmail.com</a>
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold text-club-dark mb-3">Réclamation</h2>
        <p className="text-club-gray leading-relaxed">
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-club-gold hover:underline">CNIL</a>{' '}
          (Commission Nationale de l'Informatique et des Libertés).
        </p>
      </section>
    </div>
  )
}
