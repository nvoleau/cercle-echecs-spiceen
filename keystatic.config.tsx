import { config, collection, singleton, fields } from '@keystatic/core'

const useGithubStorage =
  process.env.KEYSTATIC_GITHUB_CLIENT_ID !== undefined &&
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET !== undefined

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
      Contenu: ['evenements', 'horaires', 'resultats'],
    },
  },

  collections: {
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
          description: 'Ex: 18h15',
          validation: { isRequired: true, length: { min: 2, max: 10 } },
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
      },
    }),
  },

  singletons: {
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
