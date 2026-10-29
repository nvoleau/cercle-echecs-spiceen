# Cercle d'Échecs Spicéen — Guide projet

## Présentation du club

Club d'échecs affilié à la Fédération Française des Échecs (FFE), basé à la **Salle de la Colonne, Les Epesses (85590, Vendée)**. Moins de 30 licenciés, tous niveaux, dès 8 ans. Séances chaque **lundi et mercredi à 18h15**. Première séance offerte, sans inscription préalable.

## Stack technique

- **Framework** : Next.js 15 (App Router, `force-dynamic` sur la home et les pages listant des données)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS v3
- **Base de données** : PostgreSQL (Neon serverless) via **Drizzle ORM** — plus de Keystatic/JSON, voir section dédiée ci-dessous
- **Upload d'images** : Vercel Blob (`@vercel/blob`)
- **Éditeur riche** : Tiptap (admin maison, pas Markdoc/DocumentRenderer)
- **Emails** : Resend (formulaire de contact)
- **Gestionnaire de paquets** : pnpm (fichier lock présent) — mais **npm fonctionne** dans cet environnement (node v22, npm v11)
- **Polices** : Playfair Display (serif), Inter (sans) via `next/font`

## Lancer le projet

```bash
npm install      # à faire une fois si node_modules est absent
npm run dev      # dev sur http://localhost:3000
npm run build    # build production
npm run start    # serveur production
npm run db:push    # applique lib/schema.ts à la base Postgres (Drizzle)
npm run db:studio  # explorateur visuel de la base (Drizzle Studio)
npm run db:seed    # peuple la base avec des données de départ (scripts/seed.ts)
```

> pnpm est le gestionnaire de paquets du projet (pnpm-lock.yaml présent) mais n'est pas disponible dans cet environnement. Utiliser `npm` à la place. Le dossier `node_modules` n'est pas versionné — toujours lancer `npm install` après un clone.

## ⚠️ Important : architecture CMS réelle (Keystatic a été abandonné)

Le projet a démarré avec **Keystatic** (CMS en fichiers JSON) mais a depuis migré vers une **vraie base Postgres (Neon) + admin maison**. Des traces de l'ancienne architecture subsistent et peuvent tromper :

- `data/*.json` et `data/articles/*.mdoc` : **fichiers legacy, plus lus par le code**. `lib/queries.ts` lit exclusivement la base de données.
- `@keystatic/core` et `@keystatic/next` dans `package.json` : dépendances **inutilisées**, aucun `keystatic.config.tsx` n'existe plus.
- Les routes/pages `/keystatic-login`, `/api/keystatic-auth`, `/api/keystatic-logout`, le cookie `ks_session` et les variables `KEYSTATIC_PASSWORD` / `KEYSTATIC_SECRET` : **toujours utilisés**, mais uniquement pour protéger l'admin maison (`/admin`), pas Keystatic lui-même. Les noms sont un héritage historique.
- `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` / `NEXT_PUBLIC_GITHUB_OWNER` / `NEXT_PUBLIC_GITHUB_REPO` dans `.env.example` : **obsolètes**, ne font plus rien.

L'admin réel est à **`/admin`** (pas `/keystatic`).

## Structure des fichiers

```
app/
  (main)/             # Groupe de routes publiques
    page.tsx           # Page d'accueil (Hero, Notre club, 4 raisons, Horaires, Blog*, CTA)
    blog/               # Liste + articles de blog (contenu Tiptap rendu en HTML)
    competitions/       # Résultats de matchs + récits de compétitions
    evenements/         # Liste des événements
    contact/            # Formulaire de contact
  admin/               # Admin maison (protégé par middleware.ts)
    articles/           # CRUD articles de blog
    competition-articles/ # CRUD récits de compétitions
    evenements/         # CRUD événements
    horaires/           # CRUD horaires des séances
    tarifs/             # Édition des tarifs (ligne unique)
  api/admin/           # Routes API CRUD (une par ressource) + upload/route.ts (Vercel Blob)
components/
  Navbar.tsx          # Navigation sticky (logo + nom + liens + hamburger mobile)
  Footer.tsx          # Pied de page
  SectionHeader.tsx   # Composant titre de section réutilisable
  ArticleCard.tsx / CompetitionArticleCard.tsx  # Cartes d'aperçu
  EventCard.tsx       # Carte d'événement
  ScheduleGrid.tsx    # Grille des horaires
  ContactForm.tsx     # Formulaire de contact
lib/
  db.ts               # Connexion Neon + instance Drizzle
  schema.ts           # Schéma des tables Postgres (source de vérité des données)
  queries.ts          # Toutes les lectures/écritures passent par ici
  types.ts            # Types partagés (Article, Evenement, Resultats, etc.)
  admin-auth.ts        # requireAdmin() / checkAdminRequest() — auth admin
middleware.ts         # Protège /admin(.*) et /api/admin(.*) via cookie ks_session
scripts/seed.ts        # Seed initial de la base (horaires, tarifs, saisons, competitions, matchs…)
public/
  logo.png            # Logo principal du club (utilisé dans Navbar et Hero)
  logo.svg            # Logo SVG (placeholder dans section "Notre club")
  pawn-pattern.svg    # Motif de fond du hero
data/                 # LEGACY — plus utilisé par le code, ne pas s'y fier
```

*La section Blog sur la page d'accueil s'affiche uniquement si au moins un article existe (3 plus récents).

## Modèle de données (Drizzle — `lib/schema.ts`)

| Table | Rôle | Admin UI ? |
|---|---|---|
| `horaires` | Horaires des séances | ✅ `/admin/horaires` |
| `evenements` | Tournois, stages, soirées blitz | ✅ `/admin/evenements` |
| `tarifs` | Cotisations (ligne unique, id=1) | ✅ `/admin/tarifs` |
| `articles` | Articles de blog | ✅ `/admin/articles` |
| `competition_articles` | Récits de compétitions (affichés sur `/competitions`) | ✅ `/admin/competition-articles` |
| `saisons` | Saison en cours (ex. "2025-2026") | ❌ aucune UI |
| `competitions` | Une compétition/équipe par saison, avec classement | ❌ aucune UI |
| `matchs` | Résultats de matchs (adversaire, score, victoire/nul/défaite) rattachés à une `competition` | ❌ aucune UI |

**Point d'attention** : `saisons`, `competitions` et `matchs` (les résultats affichés sur `/competitions`) n'ont **pas d'interface d'admin**. Pour les modifier : `npm run db:studio` (Drizzle Studio) ou éditer/étendre `scripts/seed.ts`.

## Tokens de couleur (Tailwind)

| Token          | Valeur    | Usage                          |
|----------------|-----------|--------------------------------|
| `club-dark`    | `#1A1A1A` | Fond foncé (navbar, hero, CTA) |
| `club-gold`    | `#C9922A` | Couleur de marque / accent     |
| `club-gray`    | `#4A4A4A` | Texte secondaire               |
| `club-card`    | `#F5F5F5` | Fond des cartes                |

## Identité visuelle — règles importantes

- Le **logo** (`/logo.png`) et le **nom du club** ("Cercle d'Échecs Spicéen") sont la **marque de fabrique** du club : ils doivent toujours être mis en avant et bien visibles.
- Dans la **Navbar** : logo 52×52 px avec anneau doré, nom en `text-xl font-bold font-serif`, visible sur tous les écrans.
- Dans le **Hero** : logo centré en 128–144 px avec halo doré, nom en `<h1>` `text-4xl` → `text-6xl`, "Spicéen" en `text-club-gold`.
- Ne pas réduire la taille du logo ou du nom sans accord explicite du client.

## Conventions de code

- Composants React en `.tsx`, `'use client'` uniquement si nécessaire (interactivité).
- Les données sont lues/écrites via `lib/queries.ts` (jamais d'accès direct à `db` depuis les pages).
- Les types partagés sont dans `lib/types.ts`.
- Pas de commentaires sauf pour expliquer un comportement non évident.

## Déploiement — Vercel + GitHub

Le site est hébergé sur **Vercel**, branché sur le dépôt GitHub `master`. Chaque push déclenche un redéploiement automatique. La base Postgres (Neon) est externe et persiste indépendamment des déploiements — pas de contrainte de filesystem en lecture seule puisque les données ne sont plus stockées en fichiers.

### Variables d'environnement Vercel

| Variable | Rôle |
|---|---|
| `DATABASE_URL` ou `chess_POSTGRES_URL` | Connexion Postgres Neon (`lib/db.ts` essaie `chess_POSTGRES_URL` puis `DATABASE_URL`) |
| `BLOB_READ_WRITE_TOKEN` | Upload d'images vers Vercel Blob (fourni automatiquement si l'intégration Blob est liée au projet Vercel) |
| `RESEND_API_KEY` | Emails du formulaire de contact |
| `CONTACT_EMAIL` | Destinataire des messages |
| `NEXT_PUBLIC_SITE_URL` | URL publique (OpenGraph, sitemap) |
| `KEYSTATIC_PASSWORD` | Mot de passe admin `/admin` (nom historique, rien à voir avec Keystatic) |
| `KEYSTATIC_SECRET` | Secret HMAC pour signer le cookie session `ks_session` |

> `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO` ne sont **plus nécessaires** (résidus de l'ancien mode Keystatic GitHub storage).

## Sécurité admin

L'interface d'administration `/admin` est protégée par mot de passe via un middleware Next.js (`middleware.ts`), qui matche `/admin(.*)` et `/api/admin(.*)`.

- **Login** : `/keystatic-login` (page avec formulaire — nom historique conservé)
- **API logout** : `/api/keystatic-logout` — supprime le cookie
- **Token** : HMAC-SHA256(`KEYSTATIC_SECRET`, `KEYSTATIC_PASSWORD`) stocké dans le cookie httpOnly `ks_session` (7 jours)
- **Sans les variables d'env** : accès libre (utile en dev local sans `.env.local`)
- Logique centralisée dans `lib/admin-auth.ts` (`requireAdmin()` pour les pages, `checkAdminRequest()` pour les routes API)

Variables à ajouter dans `.env.local` en production :
```
KEYSTATIC_PASSWORD=mot-de-passe-fort
KEYSTATIC_SECRET=chaine-aleatoire-longue
```

## Blog

- Interface d'admin : `/admin/articles`
- Champs : titre, date, résumé, image de couverture (upload via Vercel Blob), contenu riche (éditeur Tiptap : gras, italique, titres, listes, images, liens)
- Les articles apparaissent sur `/blog` (tous) et sur la page d'accueil (3 plus récents, seulement s'il y en a)
- Contenu stocké en base (`articles.contenu`), pas de rendu Markdoc/`DocumentRenderer`

## Compétitions

- **Récits de compétitions** (`/admin/competition-articles`) : articles narratifs affichés en haut de `/competitions`, même mécanique que le blog.
- **Résultats de matchs** (saisons/compétitions/matchs) : affichés sur `/competitions`, mais **sans interface d'admin** — à modifier via `npm run db:studio` ou `scripts/seed.ts`. Championnat départemental Vendée, tournois ouverts.

## Contenu clé

- **Événements** : tournois, stages, soirées blitz — gérés via `/admin/evenements`.
- **Public cible** : habitants des Epesses et environs, tous âges (dès 8 ans), débutants et confirmés.
- **CTA principal** : "Nous rejoindre" → `/contact`.
