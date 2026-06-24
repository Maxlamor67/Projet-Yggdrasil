# [12.01.2026 2h00 | LIRE LES CHANGEMENTS FAITS](CHANGEMENTS.md)

# 🧱 Tech Stack

## Frontend

- React + TypeScript
- TanStack Router
- TailwindCSS v4
- ShadCN UI
- Leaflet
- [Ajouter autres libs : Zustand, Axios, etc.]

## Backend

- NestJS
- TypeScript
- Prisma / PostgreSQL
- [Autres : Auth, API, etc.]

---

## 🌳 Structure du Projet

### Structure Hiérarchique Simplifiée

```
src/
├── api/                    # Client API auto-généré (NE PAS MODIFIER MANUELLEMENT)
├── routes/                # Routes TanStack Router
├── components/            # Composants React organisés par fonctionnalité
│   ├── ui/               # Composants ShadCN UI personnalisés
│   ├── map/              # Composants cartographiques
│   ├── projects/         # Composants projets
│   └── team/             # Composants équipes
├── lib/                   # Utilitaires et configurations
├── stores/                # Stores d'état (Zustand)
├── types/                 # Définitions TypeScript
├── hooks/                 # Hooks React personnalisés
└── providers/             # Providers React (contexte, auth, etc.)
```

### 📁 Détails des Répertoires Clés

#### **`/routes`** - Architecture de Routage TanStack Router

```
routes/
├── __root.tsx           # Layout racine avec providers
├── login.tsx           # Route publique de login
├── _auth.tsx           # Layout protégé par authentification
└── _auth.*.tsx         # Routes enfants protégées
├── _auth.index.tsx
├── _auth.mainPage.$itemId.tsx
├── _auth.mainPage.tsx    # page principale pour modifier un projet
├── _auth.map.tsx
├── _auth.peopleList.tsx
├── _auth.projects.$projectId.app-connect.tsx
├── _auth.projects.$projectId.tsx
├── _auth.projectsList.tsx
├── _auth.projects.tsx
├── _auth.second.$itemId.tsx
├── _auth.second.tsx

```

**Convention de nommage :**

- `_` = Layout (s'affiche avec ses enfants)
- `$` = Paramètre dynamique (`$projectId`)
- `.` = Séparateur de chemin

#### **`/components`** - Organisation des Composants

```
components/
├── ui/                 # Composants ShadCN UI surchargés
│   ├── button.tsx     # <Button> personnalisé
│   └── form.tsx       # <FormField> avec validation
├── map/               # Fonctionnalités cartographiques
│   ├── Map.tsx       # Composant carte principal
│   └── DrawingBar.tsx # Outils de dessin
├── projects/          # Fonctionnalités projets
│   ├── ProjectForm.tsx
│   └── ProjectList.tsx
├── team/              # Gestion d'équipe
│   ├── TeamForm.tsx
│   └── MemberMultiSelect.tsx
└── navbar-components/ # Composants de navigation
```

**Bonnes pratiques :**

- Un composant par fichier
- Nommage en PascalCase
- Dossier par fonctionnalité métier

#### **`/lib`** - Bibliothèques et Utilitaires

```
lib/
├── api.ts
```

# Configuration et instances API

---

# 📄 Conventions de développement

## Branches

- `main` → Production
- `dev` → Développement
- `feature/xxx` → Nouvelles fonctionnalités
- `fix/xxx` → Corrections de bugs

## Commits (Conventional Commits)

feat: nouvelle fonctionnalité

fix: correction d'un bug

chore: tâches internes

style: formatage

refactor: refactorisation sans changement fonctionnel

---

# 🤝 Comment contribuer

1. Crée une branche :

```bash
git checkout -b feature/nouvelle-fonction
```

2. Développe la fonctionnalité
3. Exécute les tests
4. Commit propre
5. Push :

```bash
git push origin feature/nouvelle-fonction
```

6. Ouvre une Pull Request vers `dev`

---

# 🧰 Variables d’environnement

```
VITE_HTTP_API_URL="your_api_http_url" # localhost:[port]
```

---

To run this application:

```bash
npm install
npm run dev
```

# Building For Production

To build this application for production:

```bash
npm run build
```

# Docker pour la map

```
docker run -it -v "$(pwd):/data" -p 8080:8080 maptiler/tileserver-gl --file osm-2020-02-10-v3.11_france_strasbourg.mbtiles
```

et

```
docker run -it -e PBF_URL=https://download.geofabrik.de/europe/france/alsace-latest.osm.pbf -v "${PWD}:/data" -p 8081:8080 --name nominatim mediagis/nominatim:5.2
```

et si 'nominatim' est deja créé :

```
docker start nominatim
```
