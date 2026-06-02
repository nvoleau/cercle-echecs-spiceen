# Cercle d'Échecs Spicéen — Guide projet

## Présentation du club

Club d'échecs affilié à la Fédération Française des Échecs (FFE), basé à la **Salle de la Colonne, Les Epesses (85590, Vendée)**. Moins de 30 licenciés, tous niveaux, dès 8 ans. Séances chaque **lundi et mercredi à 18h15**. Première séance offerte, sans inscription préalable.

## Stack technique

- **Framework** : Next.js 15 (App Router, `force-dynamic` sur la home)
- **Langage** : TypeScript
- **Styles** : Tailwind CSS v3
- **CMS** : Keystatic (fichiers JSON locaux dans `data/`)
- **Gestionnaire de paquets** : pnpm (fichier lock présent) — mais **npm fonctionne** dans cet environnement (node v22, npm v11)
- **Polices** : Playfair Display (serif), Inter (sans) via `next/font`

## Lancer le projet

```bash
npm install      # à faire une fois si node_modules est absent
npm run dev      # dev sur http://localhost:3000
npm run build    # build production
npm run start    # serveur production
```

> pnpm est le gestionnaire de paquets du projet (pnpm-lock.yaml présent) mais n'est pas disponible dans cet environnement. Utiliser `npm` à la place. Le dossier `node_modules` n'est pas versionné — toujours lancer `npm install` après un clone.

## Structure des fichiers

```
app/
  layout.tsx          # Layout global (Navbar + Footer)
  page.tsx            # Page d'accueil (Hero, Notre club, 4 raisons, Horaires, Blog*, CTA)
  blog/               # Liste des articles de blog
    [slug]/           # Article complet (texte riche + images via DocumentRenderer)
  evenements/         # Liste des événements
  competitions/       # Résultats et compétitions
  contact/            # Formulaire de contact
components/
  Navbar.tsx          # Navigation sticky (logo + nom + liens + hamburger mobile)
  Footer.tsx          # Pied de page
  SectionHeader.tsx   # Composant titre de section réutilisable
  ArticleCard.tsx     # Carte d'aperçu d'article de blog
  EventCard.tsx       # Carte d'événement
  ScheduleGrid.tsx    # Grille des horaires
  ContactForm.tsx     # Formulaire de contact
public/
  logo.png            # Logo principal du club (utilisé dans Navbar et Hero)
  logo.svg            # Logo SVG (placeholder dans section "Notre club")
  pawn-pattern.svg    # Motif de fond du hero
  articles/           # Images des articles de blog (uploadées via Keystatic)
data/
  horaires.json       # Horaires des séances (géré via Keystatic)
  evenements/         # Un fichier JSON par événement
  articles/           # Un fichier .mdoc par article (Markdoc + frontmatter YAML)
  resultats.json      # Résultats des compétitions
  tarifs-ks.json      # Tarifs
```

*La section Blog sur la page d'accueil s'affiche uniquement si au moins un article existe (3 plus récents).

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
- Les données sont lues via `lib/reader.ts` (Keystatic reader API).
- Les types partagés sont dans `lib/types.ts`.
- Pas de commentaires sauf pour expliquer un comportement non évident.

## Déploiement — Vercel + GitHub

Le site est hébergé sur **Vercel**, branché sur le dépôt GitHub `master`. Chaque push déclenche un redéploiement automatique.

### Point critique : Keystatic en production

Vercel a un filesystem **en lecture seule** en production. Le mode local de Keystatic ne peut pas sauvegarder. Il faut le mode **GitHub storage** : Keystatic commit directement sur GitHub via l'API → Vercel redéploie automatiquement.

Le basculement est automatique dès que `KEYSTATIC_GITHUB_CLIENT_ID` et `KEYSTATIC_GITHUB_CLIENT_SECRET` sont définies (voir `keystatic.config.tsx` ligne 4-5).

### Variables d'environnement Vercel (toutes)

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | Emails du formulaire de contact |
| `CONTACT_EMAIL` | Destinataire des messages |
| `NEXT_PUBLIC_SITE_URL` | URL publique (OpenGraph, sitemap) |
| `KEYSTATIC_PASSWORD` | Mot de passe admin `/keystatic` |
| `KEYSTATIC_SECRET` | Secret HMAC pour signer le cookie session |
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub OAuth App — Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub OAuth App — Client Secret |
| `NEXT_PUBLIC_GITHUB_OWNER` | Propriétaire du dépôt GitHub |
| `NEXT_PUBLIC_GITHUB_REPO` | Nom du dépôt GitHub |

### Créer la GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App  
- Callback URL : `https://VOTRE_DOMAINE/api/keystatic/github/oauth/callback`

## Sécurité Keystatic

L'interface d'administration `/keystatic` est protégée par mot de passe via un middleware Next.js (`middleware.ts`).

- **Login** : `/keystatic-login` (page avec formulaire)
- **API auth** : `POST /api/keystatic-auth` — vérifie le mot de passe, pose un cookie `ks_session` httpOnly (7 jours)
- **API logout** : `POST /api/keystatic-logout` — supprime le cookie
- **Token** : HMAC-SHA256(KEYSTATIC_SECRET, KEYSTATIC_PASSWORD) — non falsifiable
- **Sans les variables d'env** : accès libre (utile en dev local sans `.env.local`)

Variables à ajouter dans `.env.local` en production :
```
KEYSTATIC_PASSWORD=mot-de-passe-fort
KEYSTATIC_SECRET=chaine-aleatoire-longue
```

## Blog

- Interface d'admin : `/keystatic` → section "Blog" → "Articles de blog"
- Champs : titre, date, résumé, image de couverture, contenu riche (gras, italique, titres, listes, images, liens, séparateurs, citations)
- Images stockées dans `public/articles/`, référencées automatiquement
- Les articles apparaissent sur `/blog` (tous) et sur la page d'accueil (3 plus récents, seulement si il y en a)
- Rendu côté serveur via `DocumentRenderer` de `@keystatic/core/renderer` avec styles Tailwind custom (pas de `@tailwindcss/typography`)

## Contenu clé

- **Événements** : tournois, stages, soirées blitz — données dans `data/evenements/`.
- **Compétitions** : championnat départemental Vendée, tournois ouverts.
- **Public cible** : habitants des Epesses et environs, tous âges (dès 8 ans), débutants et confirmés.
- **CTA principal** : "Nous rejoindre" → `/contact`.
