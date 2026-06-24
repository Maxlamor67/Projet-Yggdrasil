# Documentation Docker

Ce projet utilise Docker et Docker Compose pour lancer plusieurs services.

## Services

### 1. API NestJS
- **Port**: 8000
- **URL**: http://localhost:8000
- **Documentation API (Swagger)**: http://localhost:8000/api
- Framework: NestJS avec TypeScript
- Base de données: PostgreSQL avec Prisma ORM
- Authentification: Better Auth
- WebSocket: Socket.io
- Les migrations Prisma sont automatiquement appliquées au démarrage

### 2. Application Web (Tanstack Router)
- **Port**: 3000
- **URL**: http://localhost:3000
- Framework: TanStack Router avec React
- UI: Shadcn/ui + Tailwind CSS
- Build avec Vite et servi par Nginx

### 3. Serveur de Tuiles (TileServer GL)
- **Port**: 8080
- **URL**: http://localhost:8080
- Sert les tuiles de carte depuis `osm-2020-02-10-v3.11_france_strasbourg.mbtiles`
- Service de tuiles de carte pour Strasbourg (MapTiler)

### 4. Service de Recherche (Nominatim)
- **Port**: 8081
- **URL**: http://localhost:8081
- Service de géocodage pour la recherche d'adresses
- Zone couverte: Alsace

## Prérequis

- Docker Desktop installé
- Docker Compose installé
- Le fichier `osm-2020-02-10-v3.11_france_strasbourg.mbtiles` doit être présent à la racine du projet

## Utilisation

### Démarrer tous les services

```bash
docker-compose up -d
```

### Démarrer avec rebuild

```bash
docker-compose up -d --build
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f tileserver
docker-compose logs -f nominatim
```

### Arrêter les services

```bash
docker-compose down
```

### Arrêter et supprimer les volumes

```bash
docker-compose down -v
```

## Services individuels

### Démarrer uniquement l'API

```bash
docker-compose up -d api
```

### Démarrer uniquement l'application web

```bash
docker-compose up -d web
```

### Démarrer uniquement le serveur de tuiles

```bash
docker-compose up -d tileserver
```

### Démarrer uniquement Nominatim

```bash
docker-compose up -d nominatim
```

## Vérification

Une fois les services démarrés, vous pouvez vérifier leur état :

```bash
docker-compose ps
```

## URLs d'accès

- **API NestJS**: http://localhost:8000
- **Documentation API (Swagger)**: http://localhost:8000/api
- **Application Web**: http://localhost:3000
- **TileServer**: http://localhost:8080
- **Nominatim**: http://localhost:8081



## Notes importantes

### API (Premier démarrage)
Au démarrage, l'API exécute automatiquement `npx prisma migrate deploy` pour appliquer les migrations de base de données.

### Nominatim (Premier démarrage)
⚠️ **Attention**: Le premier démarrage de Nominatim peut prendre **beaucoup de temps** (30 minutes à plusieurs heures) car il doit télécharger et indexer les données OSM d'Alsace.

Vous pouvez suivre la progression avec :
```bash
docker-compose logs -f nominatim
```

### Ressources système
Nominatim nécessite des ressources importantes :
- RAM: Au moins 4 GB recommandés (shm_size configuré à 1GB)
- Disque: Plusieurs GB pour les données indexées

### Volumes persistants
- **nominatim-data**: Les données de Nominatim sont stockées dans un volume Docker nommé `nominatim-data` pour persister entre les redémarrages

## Développement

Pour le développement en local sans Docker :

```bash
npm run dev
```

## Build manuel (sans Docker Compose)

### Build l'image

```bash
docker build -t web-tanstack .
```

### Run le container

```bash
docker run -p 3000:80 web-tanstack
```

## Architecture

Le docker-compose orchestre 4 services interconnectés sur un réseau Docker `app-network` :

```
┌─────────────────┐
│   Application   │
│   Web (React)   │  Port 3000
│  TanStack Router│
└────────┬────────┘
         │
         ├─────────► API NestJS (Port 8000)
         │           └─► PostgreSQL (Prisma)
         │           └─► Better Auth
         │           └─► WebSocket (Socket.io)
         │
         ├─────────► TileServer (Port 8080)
         │           └─► Tuiles de carte Strasbourg
         │
         └─────────► Nominatim (Port 8081)
                     └─► Recherche géographique Alsace
```

## Troubleshooting

### L'API ne démarre pas
- Vérifiez que le fichier `../api/.env` existe avec toutes les variables requises
- Vérifiez que la base de données PostgreSQL est accessible
- Consultez les logs : `docker-compose logs -f api`

### Erreur de migration Prisma
Si les migrations échouent, vérifiez la connexion à la base de données et les permissions.

### Le serveur de tuiles ne démarre pas
Vérifiez que le fichier `osm-2020-02-10-v3.11_france_strasbourg.mbtiles` existe à la racine du projet.

### Nominatim ne répond pas
Le premier démarrage est long. Attendez que l'indexation soit terminée.

### Erreur de mémoire avec Nominatim
Augmentez la mémoire allouée à Docker Desktop dans les paramètres.

### Port déjà utilisé
Si un port est déjà utilisé, modifiez-le dans le `docker-compose.yml` :
```yaml
ports:
  - "NOUVEAU_PORT:80"
```
