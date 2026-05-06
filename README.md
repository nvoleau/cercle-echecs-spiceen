# Cercle d'Échecs Spicéen — Site Web

Site officiel du Cercle d'Échecs Spicéen, club d'échecs affilié FFE basé aux Epesses (Vendée).

## Stack technique

| Technologie | Usage |
|-------------|-------|
| **Next.js 14** (App Router) | Framework React SSR/SSG |
| **TypeScript** (strict) | Typage complet |
| **Tailwind CSS v3** | Styling utility-first |
| **Lucide React** | Iconographie |
| **Resend** | Envoi d'emails (formulaire contact) |
| **pnpm** | Gestionnaire de paquets |

## Démarrage rapide

### Prérequis

- Node.js 20 LTS
- pnpm (`npm install -g pnpm`)

### Installation

```bash
pnpm install
```

### Configuration

Copiez `.env.example` vers `.env.local` et remplissez les variables :

```bash
cp .env.example .env.local
```

```env
RESEND_API_KEY=re_xxxxxxxxxxxx        # Clé API Resend (https://resend.com)
CONTACT_EMAIL=votre@email.fr          # Email de réception des messages
NEXT_PUBLIC_SITE_URL=https://...      # URL de production
```

### Développement local

```bash
pnpm dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

### Build de production

```bash
pnpm build
pnpm start
```

## Structure du projet

```
├── app/                    # Pages (Next.js App Router)
│   ├── layout.tsx          # Layout global (Navbar, Footer, meta)
│   ├── page.tsx            # Accueil
│   ├── evenements/         # Page événements
│   ├── competitions/       # Page compétitions
│   ├── contact/            # Page contact
│   ├── not-found.tsx       # 404 custom
│   ├── sitemap.ts          # Sitemap auto
│   ├── robots.ts           # robots.txt
│   └── api/contact/        # Route API formulaire de contact
├── components/             # Composants réutilisables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── EventCard.tsx
│   ├── ScheduleGrid.tsx
│   ├── ContactForm.tsx
│   └── SectionHeader.tsx
├── data/                   # Données (versionné Git)
│   ├── evenements.json     # Événements du club
│   ├── resultats.json      # Résultats des compétitions
│   └── horaires.json       # Horaires des séances
├── lib/                    # Utilitaires TypeScript
│   ├── types.ts
│   └── utils.ts
└── public/                 # Assets statiques
    ├── logo.svg
    └── pawn-pattern.svg
```

## Mise à jour du contenu

Tout le contenu est géré via les fichiers JSON dans `/data`. Aucun back-office nécessaire.

### Ajouter un événement

Ouvrir `data/evenements.json` et ajouter un objet :

```json
{
  "id": "identifiant-unique",
  "titre": "Nom de l'événement",
  "date": "2025-09-15",
  "heure": "18h15",
  "type": "tournoi",
  "description": "Description courte.",
  "lieu": "Salle de la Colonne, Les Epesses"
}
```

Types disponibles : `"tournoi"` | `"blitz"` | `"cours"` | `"autre"`

### Ajouter un résultat

Ouvrir `data/resultats.json` et ajouter un match dans le tableau `matchs` de la compétition correspondante.

### Modifier les horaires

Ouvrir `data/horaires.json` et modifier les champs `heure_debut`, `heure_fin`, `lieu` selon les changements.

### Déploiement

Après modification des JSON :

```bash
git add data/ && git commit -m "feat: mise à jour contenu" && git push
```

Le déploiement s'effectue automatiquement en ~2 minutes sur Vercel.

## Déploiement

### Vercel (recommandé)

1. Connecter le dépôt GitHub à [Vercel](https://vercel.com)
2. Configurer les variables d'environnement dans le dashboard Vercel
3. Le déploiement est automatique à chaque push sur `main`

### Variables d'environnement requises en production

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails |
| `CONTACT_EMAIL` | Email de destination du formulaire |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (ex: `https://cercle-echecs-spiceen.fr`) |

## Charte graphique

| Rôle | Valeur |
|------|--------|
| Fond sombre | `#1A1A1A` |
| Accent or | `#C9922A` |
| Fond clair | `#FFFFFF` |
| Texte secondaire | `#4A4A4A` |
| Fond carte | `#F5F5F5` |
| Police titres | Playfair Display (serif) |
| Police corps | Inter (sans-serif) |

## Licence

Usage interne — Cercle d'Échecs Spicéen.
