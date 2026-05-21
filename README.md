# Cercle d'Échecs Spicéen — Site Web

Site officiel du Cercle d'Échecs Spicéen, club d'échecs affilié FFE basé aux Epesses (Vendée, 85420).

---

## Stack technique

| Technologie | Usage |
|---|---|
| **Next.js 15** (App Router) | Framework React, rendu serveur |
| **TypeScript** | Typage complet |
| **Tailwind CSS v3** | Styles |
| **Keystatic** | CMS — interface d'admin et gestion du contenu |
| **Resend** | Envoi d'emails (formulaire de contact) |
| **Vercel** | Hébergement et déploiement continu |

---

## Développement local

### Prérequis

- Node.js 20 LTS minimum (`node --version` pour vérifier)
- npm (inclus avec Node.js) — pnpm n'est pas requis malgré le `pnpm-lock.yaml`

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/VOTRE_ORG/cercle-echecs-spiceen.git
cd cercle-echecs-spiceen

# 2. Installer les dépendances (obligatoire après chaque clone)
npm install

# 3. Copier les variables d'environnement
cp .env.example .env.local
# → Remplir .env.local avec vos valeurs (voir section Variables ci-dessous)

# 4. Lancer le serveur de développement
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).  
L'interface d'administration Keystatic est sur [http://localhost:3000/keystatic](http://localhost:3000/keystatic).

> **En local**, Keystatic fonctionne en mode fichier local : les articles, événements, etc. sont sauvegardés directement dans `data/`. Aucune configuration GitHub nécessaire pour développer.

### Commandes utiles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production (vérifie les erreurs TypeScript)
npm run start    # Serveur de production local (après build)
npm run lint     # Vérification ESLint
```

---

## Gestion du contenu (Keystatic)

Tout le contenu du site est géré via l'interface d'administration Keystatic, accessible à `/keystatic`.

### Accès à l'admin

L'interface est **protégée par mot de passe**. Les identifiants sont définis par les variables `KEYSTATIC_PASSWORD` et `KEYSTATIC_SECRET` dans `.env.local` / Vercel.

> En développement local sans ces variables, l'accès est libre (pas de page de login).

### Ce que vous pouvez gérer

| Section | Contenu |
|---|---|
| **Blog → Articles** | Créer/modifier des articles avec texte riche, images, titres, liens… |
| **Contenu → Événements** | Tournois, blitz, stages, cours |
| **Contenu → Horaires** | Jours et heures des séances |
| **Contenu → Tarifs** | Cotisations de la saison |
| **Contenu → Résultats** | Résultats des compétitions |

### Comment créer un article de blog

1. Aller sur `/keystatic`
2. Section **Blog** → **Articles de blog** → **Créer un article**
3. Remplir : titre, date, résumé, image de couverture, contenu riche
4. Sauvegarder → l'article est publié (en production, après le redéploiement automatique)

---

## Déploiement sur Vercel

### ⚠️ Point important : mode de stockage Keystatic

Vercel ne permet pas d'écrire sur le filesystem en production. Si Keystatic est en mode local, les modifications faites via l'admin **ne seront pas sauvegardées**.

**Solution : activer le mode GitHub.** Keystatic peut sauvegarder directement sur GitHub via l'API (commit automatique). Vercel détecte le nouveau commit et redéploie en ~2 minutes.

Le projet est déjà configuré pour basculer automatiquement en mode GitHub dès que les variables `KEYSTATIC_GITHUB_CLIENT_ID` et `KEYSTATIC_GITHUB_CLIENT_SECRET` sont définies.

### Étape 1 — Créer une GitHub OAuth App

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Remplir :
   - **Application name** : `Cercle Échecs Spicéen - Keystatic`
   - **Homepage URL** : `https://votre-domaine.vercel.app`
   - **Authorization callback URL** : `https://votre-domaine.vercel.app/api/keystatic/github/oauth/callback`
3. Copier le **Client ID** et générer un **Client Secret**

### Étape 2 — Configurer les variables sur Vercel

Dans le dashboard Vercel → **Settings** → **Environment Variables**, ajouter :

| Variable | Description | Obligatoire |
|---|---|---|
| `RESEND_API_KEY` | Clé API [Resend](https://resend.com) pour les emails | Oui |
| `CONTACT_EMAIL` | Email de réception du formulaire de contact | Oui |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (ex: `https://cercle-echecs-spiceen.fr`) | Oui |
| `KEYSTATIC_PASSWORD` | Mot de passe pour accéder à `/keystatic` | Oui |
| `KEYSTATIC_SECRET` | Chaîne aléatoire longue pour signer le cookie de session | Oui |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Client ID de la GitHub OAuth App | Pour le CMS en prod |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Client Secret de la GitHub OAuth App | Pour le CMS en prod |
| `NEXT_PUBLIC_GITHUB_OWNER` | Nom d'utilisateur ou organisation GitHub du dépôt | Pour le CMS en prod |
| `NEXT_PUBLIC_GITHUB_REPO` | Nom du dépôt GitHub (ex: `cercle-echecs-spiceen`) | Pour le CMS en prod |

> **Générer `KEYSTATIC_SECRET`** : une chaîne aléatoire de 32+ caractères. Exemple avec le terminal : `openssl rand -hex 32`

### Étape 3 — Connecter le dépôt GitHub à Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → importer le dépôt GitHub
2. Framework détecté automatiquement : **Next.js**
3. Ajouter toutes les variables d'environnement (étape 2)
4. **Deploy**

Chaque push sur `master` déclenche un redéploiement automatique.

### Flux de mise à jour du contenu en production

```
Admin ouvre /keystatic
  → saisit le mot de passe (notre middleware)
  → autorise l'accès GitHub (OAuth Keystatic)
  → modifie un article / événement
  → clique "Sauvegarder"
      → Keystatic commit sur GitHub
          → Vercel détecte le commit
              → Redéploiement automatique (~2 min)
                  → Contenu mis à jour sur le site
```

---

## Structure du projet

```
├── app/
│   ├── layout.tsx               # Layout global (Navbar, Footer, meta)
│   ├── page.tsx                 # Accueil (Hero, club, horaires, blog, CTA)
│   ├── blog/                    # Liste des articles
│   │   └── [slug]/              # Article complet
│   ├── evenements/              # Page événements
│   ├── competitions/            # Page compétitions
│   ├── contact/                 # Page contact
│   ├── keystatic/               # Interface d'admin Keystatic
│   ├── keystatic-login/         # Page de connexion (protection par mot de passe)
│   └── api/
│       ├── keystatic/           # Route handler Keystatic
│       ├── keystatic-auth/      # Vérification mot de passe → cookie session
│       ├── keystatic-logout/    # Suppression cookie (déconnexion)
│       └── contact/             # Envoi email via Resend
├── components/                  # Composants réutilisables
├── data/                        # Contenu (versionné Git)
│   ├── articles/                # Articles de blog (.mdoc)
│   ├── evenements/              # Événements (.json)
│   ├── horaires-ks.json
│   ├── tarifs-ks.json
│   └── resultats-ks.json
├── lib/
│   ├── reader.ts                # Keystatic reader (lecture des données)
│   └── types.ts                 # Types TypeScript partagés
├── public/
│   ├── logo.png                 # Logo du club
│   └── articles/                # Images uploadées via l'admin blog
├── middleware.ts                 # Protection de /keystatic par mot de passe
└── keystatic.config.tsx         # Configuration du CMS
```

---

## Charte graphique

| Token | Couleur | Usage |
|---|---|---|
| `club-dark` | `#1A1A1A` | Fond foncé (navbar, hero) |
| `club-gold` | `#C9922A` | Couleur de marque, accents |
| `club-gray` | `#4A4A4A` | Texte secondaire |
| `club-card` | `#F5F5F5` | Fond des cartes |
| Serif | Playfair Display | Titres |
| Sans | Inter | Corps de texte |

---

## Licence

Usage interne — Cercle d'Échecs Spicéen.
