import { config, collection, singleton, fields } from '@keystatic/core'

// NEXT_PUBLIC_ requis pour que la détection fonctionne aussi côté client (admin UI)
const useGithubStorage =
  !!process.env.NEXT_PUBLIC_GITHUB_OWNER &&
  !!process.env.NEXT_PUBLIC_GITHUB_REPO

export default config({
  storage: useGithubStorage
    ? {
        kind: 'github',
        repo: {
          owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? 'votre-org',
          name: process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'cercle-echecs-spiceen',
        },
      }
    : { kind: 'local' },

  ui: {
    brand: {
      name: 'Cercle d\'Échecs Spicéen',
    },
    navigation: {
      Blog: ['articles'],
      Contenu: ['evenements', 'horaires', 'tarifs', 'resultats'],
    },
  },

  collections: {
    articles: collection({
      label: 'Articles de blog',
      slugField: 'titre',
      path: 'data/articles/*',
      format: { contentField: 'contenu' },
      schema: {
        titre: fields.slug({
          name: {
            label: 'Titre',
            validation: { isRequired: true },
          },
        }),
        date: fields.date({
          label: 'Date de publication',
          validation: { isRequired: true },
        }),
        resume: fields.text({
          label: 'Résumé',
          description: 'Texte court affiché dans les aperçus (2-3 phrases)',
          multiline: true,
          validation: { isRequired: true },
        }),
        image_couverture: fields.image({
          label: 'Image de couverture',
          directory: 'public/articles',
          publicPath: '/articles/',
        }),
        contenu: fields.document({
          label: 'Contenu',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/articles',
            publicPath: '/articles/',
          },
        }),
      },
    }),

    evenements: collection({
      label: 'Événements',
      slugField: 'titre',
      path: 'data/evenements/*',
      format: { data: 'json' },
      schema: {
        titre: fields.slug({
          name: {
            label: 'Titre',
            description: 'Nom de l\'événement',
          },
        }),
        date: fields.date({
          label: 'Date',
          validation: { isRequired: true },
        }),
        heure: fields.text({
          label: 'Heure',
          description: 'Ex: 18h15 ou 14h00 – 18h00',
          validation: { isRequired: true, length: { min: 2, max: 20 } },
        }),
        type: fields.select({
          label: 'Type d\'événement',
          options: [
            { label: 'Tournoi', value: 'tournoi' },
            { label: 'Blitz', value: 'blitz' },
            { label: 'Cours', value: 'cours' },
            { label: 'Autre', value: 'autre' },
          ],
          defaultValue: 'tournoi',
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        lieu: fields.text({
          label: 'Lieu',
          defaultValue: 'Salle de la Colonne, Les Epesses',
        }),
        tarif: fields.text({
          label: 'Tarif',
          description: 'Ex: 8 € — laisser vide si gratuit',
        }),
        lienInscription: fields.text({
          label: 'Lien d\'inscription',
          description: 'URL HelloAsso ou autre plateforme (laisser vide si pas d\'inscription en ligne)',
        }),
        affiche: fields.text({
          label: 'Affiche (chemin image)',
          description: 'Chemin vers l\'image dans /public, ex: /evenements/affiche-tournoi-juin-2026.jpg',
        }),
      },
    }),
  },

  singletons: {
    tarifs: singleton({
      label: 'Tarifs',
      path: 'data/tarifs-ks',
      format: { data: 'json' },
      schema: {
        saison: fields.text({
          label: 'Saison (ex: 2025-2026)',
          validation: { isRequired: true },
        }),
        cotisation_adulte: fields.text({
          label: 'Cotisation adulte',
          description: 'Ex: 80 € — laisser "—" si non encore défini',
        }),
        cotisation_enfant: fields.text({
          label: 'Cotisation enfant (−18 ans)',
          description: 'Ex: 50 € — laisser "—" si non encore défini',
        }),
        licence_ffe_incluse: fields.checkbox({
          label: 'Licence FFE incluse dans la cotisation',
          defaultValue: true,
        }),
        note: fields.text({
          label: 'Note complémentaire',
          description: 'Ex: Paiement en plusieurs fois possible',
          multiline: true,
        }),
      },
    }),

    horaires: singleton({
      label: 'Horaires des séances',
      path: 'data/horaires-ks',
      format: { data: 'json' },
      schema: {
        seances: fields.array(
          fields.object({
            id: fields.text({ label: 'Identifiant (ex: lundi)', validation: { isRequired: true } }),
            jour: fields.text({ label: 'Jour (ex: Lundi)', validation: { isRequired: true } }),
            heure_debut: fields.text({ label: 'Heure de début (ex: 18h15)', validation: { isRequired: true } }),
            heure_fin: fields.text({ label: 'Heure de fin (ex: 19h45)', validation: { isRequired: true } }),
            libelle: fields.text({ label: 'Libellé (ex: Cours & séance club)' }),
            lieu: fields.text({ label: 'Lieu', defaultValue: 'Salle de la Colonne, Les Epesses' }),
          }),
          {
            label: 'Séances',
            itemLabel: (props) => props.fields.jour.value || 'Séance',
          }
        ),
      },
    }),

    resultats: singleton({
      label: 'Résultats des compétitions',
      path: 'data/resultats-ks',
      format: { data: 'json' },
      schema: {
        saison: fields.text({
          label: 'Saison (ex: 2024-2025)',
          validation: { isRequired: true },
        }),
        competitions: fields.array(
          fields.object({
            nom: fields.text({ label: 'Nom de la compétition', validation: { isRequired: true } }),
            equipe: fields.text({ label: 'Équipe (ex: 1re équipe)' }),
            classement: fields.number({ label: 'Classement (laisser vide si inconnu)' }),
            matchs: fields.array(
              fields.object({
                adversaire: fields.text({ label: 'Adversaire', validation: { isRequired: true } }),
                domicile: fields.checkbox({ label: 'Match à domicile', defaultValue: true }),
                score_nous: fields.number({ label: 'Notre score', validation: { isRequired: true } }),
                score_eux: fields.number({ label: 'Score adversaire', validation: { isRequired: true } }),
                resultat: fields.select({
                  label: 'Résultat',
                  options: [
                    { label: 'Victoire', value: 'victoire' },
                    { label: 'Nul', value: 'nul' },
                    { label: 'Défaite', value: 'defaite' },
                  ],
                  defaultValue: 'victoire',
                }),
              }),
              {
                label: 'Matchs',
                itemLabel: (props) => props.fields.adversaire.value || 'Match',
              }
            ),
          }),
          {
            label: 'Compétitions',
            itemLabel: (props) => props.fields.nom.value || 'Compétition',
          }
        ),
      },
    }),
  },
})
