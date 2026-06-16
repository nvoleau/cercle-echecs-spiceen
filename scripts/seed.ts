import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function seed() {
  console.log('Seeding database...')

  await db.insert(schema.horaires).values([
    {
      id: 'lundi',
      jour: 'Lundi',
      heure_debut: '18h15',
      heure_fin: '19h45',
      libelle: 'Cours & séance club',
      lieu: 'Salle de la Colonne, Les Epesses',
    },
    {
      id: 'mercredi',
      jour: 'Mercredi',
      heure_debut: '18h15',
      heure_fin: '19h45',
      libelle: 'Cours & séance club',
      lieu: 'Salle de la Colonne, Les Epesses',
    },
  ]).onConflictDoNothing()

  await db.insert(schema.tarifs).values({
    id: 1,
    saison: '2025-2026',
    cotisation_adulte: '—',
    cotisation_enfant: '—',
    licence_ffe_incluse: true,
    note: '',
  }).onConflictDoNothing()

  await db.insert(schema.evenements).values([
    {
      id: 'tournoi-printemps-2025',
      titre: 'Tournoi de Printemps',
      date: '2025-06-14',
      heure: '14h00',
      type: 'tournoi',
      description:
        'Tournoi interne open à tous les niveaux. Formule suisse en 5 rondes. Inscription obligatoire avant le 10 juin.',
      lieu: 'Salle de la Colonne, Les Epesses',
    },
    {
      id: 'soiree-blitz-juin-2025',
      titre: 'Soirée Blitz',
      date: '2025-06-02',
      heure: '18h15',
      type: 'blitz',
      description:
        'Parties rapides (5 minutes par joueur) dans une ambiance conviviale. Ouvert à tous les membres.',
      lieu: 'Salle de la Colonne, Les Epesses',
    },
    {
      id: 'stage-initiation-juillet-2025',
      titre: 'Stage Initiation Échecs',
      date: '2025-07-07',
      heure: '10h00',
      type: 'cours',
      description:
        "Stage d'initiation aux échecs pour les débutants de 8 ans et plus. Règles du jeu, tactiques de base, parties commentées.",
      lieu: 'Salle de la Colonne, Les Epesses',
    },
    {
      id: '1er-tournoi-libre-juin-2026',
      titre: "1er Tournoi Libre d'Échecs",
      date: '2026-06-07',
      heure: '14h00 – 18h00',
      type: 'tournoi',
      description:
        "Tournoi non homologué ouvert à tous niveaux — débutants, amateurs et confirmés bienvenus ! 5 rondes, cadence 12 min + 5 sec/coup. Nombreux lots à gagner. Goûter sur place. Inscription avant le 31 mai via HelloAsso.",
      lieu: 'Salle Sainte-Marie, Les Epesses',
      tarif: '8 €',
      lien_inscription:
        'https://www.helloasso.com/associations/cercle-d-echecs-spiceen/evenements/1er-tournoi-libre-d-echecs-cercle-d-echecs-spiceen',
      affiche: '/evenements/affiche-tournoi-juin-2026.jpg',
    },
  ]).onConflictDoNothing()

  const [saisonRow] = await db
    .insert(schema.saisons)
    .values({ saison: '2024-2025' })
    .returning()

  const [comp1] = await db
    .insert(schema.competitions)
    .values({
      saison_id: saisonRow.id,
      nom: 'Championnat Départemental Vendée',
      equipe: '1re équipe',
      classement: 3,
    })
    .returning()

  await db.insert(schema.matchs).values([
    {
      competition_id: comp1.id,
      adversaire: "Club d'Échecs de La Roche-sur-Yon",
      domicile: true,
      score_nous: 3,
      score_eux: 1,
      resultat: 'victoire',
    },
    {
      competition_id: comp1.id,
      adversaire: 'Club de Challans',
      domicile: false,
      score_nous: 2,
      score_eux: 2,
      resultat: 'nul',
    },
    {
      competition_id: comp1.id,
      adversaire: "Club des Sables-d'Olonne",
      domicile: true,
      score_nous: 1,
      score_eux: 3,
      resultat: 'defaite',
    },
    {
      competition_id: comp1.id,
      adversaire: 'Club de Fontenay-le-Comte',
      domicile: false,
      score_nous: 3,
      score_eux: 1,
      resultat: 'victoire',
    },
  ])

  await db.insert(schema.competitions).values({
    saison_id: saisonRow.id,
    nom: 'Open Vendéen',
    equipe: 'Individuel',
  })

  // Article de blog existant
  await db.insert(schema.articles).values({
    slug: 'echecs-et-enfants-apprendre-a-reflechir-perseverer-et-prendre-confiance-en-s-amusant',
    titre: "Échecs et enfants : apprendre à réfléchir, persévérer et prendre confiance… en s'amusant",
    date: '2026-06-02',
    resume: "Pourquoi les échecs sont bien plus qu'un jeu : une activité qui aide les enfants à grandir… dès 5 ans",
    image_couverture: '/articles/echecs-et-enfants-apprendre-a-reflechir-perseverer-et-prendre-confiance-en-s-amusant/image_couverture.jpeg',
    contenu: `**Pourquoi les échecs sont bien plus qu'un jeu : une activité qui aide les enfants à grandir… dès 5 ans**

Quand on évoque le jeu d'échecs, beaucoup imaginent encore une activité réservée aux passionnés ou aux joueurs expérimentés. Pourtant, derrière les 64 cases se cache bien davantage qu'un simple jeu : **les échecs constituent un formidable outil d'apprentissage, de développement personnel et de partage entre générations.**

![Un jeu transgénérationnel](/articles/echecs-et-enfants-apprendre-a-reflechir-perseverer-et-prendre-confiance-en-s-amusant/enfant-grandpere-jeu-transgenerationnel.gif)

Depuis quelques années, de plus en plus d'écoles, d'associations et de familles s'y intéressent. Et pour cause : les bénéfices dépassent largement le cadre du jeu.

Au **Cercle d'Échecs Spicéen**, aux Epesses, nous observons régulièrement à quel point les enfants évoluent au fil des séances.

**Une activité accessible à tous, dès 5 ans**

Contrairement aux idées reçues, il n'est pas nécessaire d'être un « génie » pour commencer les échecs.

Un enfant de 5 ou 6 ans peut très vite apprendre comment se déplacent les pièces, reconnaître certaines situations simples ou résoudre ses premiers petits défis.

**Filles et garçons : une place pour chacun autour de l'échiquier**

**Judit Polgár** est probablement l'exemple le plus connu. Considérée comme la plus grande joueuse de l'histoire, elle a battu plusieurs champions du monde masculins.

![Judit Polgár](/articles/echecs-et-enfants-apprendre-a-reflechir-perseverer-et-prendre-confiance-en-s-amusant/judit-polgar.jpg)

**Les échecs apprennent à prendre des décisions**

Devant un échiquier, personne ne décide à votre place. Très tôt, l'enfant découvre que chaque choix entraîne des conséquences.

**Perdre… puis recommencer : une leçon utile pour toute la vie**

Une défaite devient :

- une erreur à comprendre
- une idée à améliorer
- une occasion de progresser

**Concentration, discipline et gestion des émotions**

Une partie demande de rester attentif plusieurs minutes. Il faut apprendre à se concentrer, gérer son impatience, accepter certaines frustrations.

![Des enfants se serrent la main après une partie](/articles/echecs-et-enfants-apprendre-a-reflechir-perseverer-et-prendre-confiance-en-s-amusant/enfants-poignee-de-main.gif)

**Ce que nous essayons de construire au Cercle d'Échecs Spicéen**

Nous essayons de proposer un lieu où chacun puisse prendre plaisir à jouer, progresser sans pression inutile, rencontrer d'autres passionnés et partager un moment convivial.

![Les Epesses, au cœur de la Vendée](/articles/echecs-et-enfants-apprendre-a-reflechir-perseverer-et-prendre-confiance-en-s-amusant/les-epesses-vendee.gif)

Que vous recherchiez une activité enrichissante pour votre enfant en Vendée, nous serons heureux de vous accueillir. **Chacun a sa place autour d'un échiquier.**`,
    publie: true,
  }).onConflictDoNothing()

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
