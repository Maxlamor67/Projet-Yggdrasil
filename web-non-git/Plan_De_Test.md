# Plan de tests  projet web

Ce document est le plan général et précis de la stratégie décidé de la solution web : routage dynamique, rendu d'éléments créés dynamiquement (listes, cartes, marqueurs), chargements asynchrones, interactions utilisateur (dessin, modification d'entités).

## 1. Portée
- Composants front-end dynamiques : routes définies dans `src/routes` (segments `$param`), composants `src/components/*`, en particulier `src/components/map/*`, `projects`, `team`, `user` et `ListViewer`.
- Intégration front-to-back : échanges via `src/lib/api.ts` et `src/api/*.ts` (mockés en tests d'UI/integration).
- Exclusions : tests back-end profonds et performance/charge.

## 2. Objectifs
- Vérifier que les routes dynamiques rendent les bons composants et passent correctement les paramètres (`$projectId`, `$itemId`, etc.).
- Valider le rendu dynamique : listes, cartes, marqueurs et formulaires pré-remplis selon le `param` ou la réponse API.
- Tester les flux utilisateur interactifs : création/édition/suppression d'éléments, dessin sur la carte, capture d'écran, sélection multiple.
- Valider la gestion des états asynchrones : loaders, erreurs API, retries et messages d'état.

## 3. Approche et niveaux de test
- Tests unitaires (Jest + Testing Library React) : isolation des composants, assertions DOM sur rendu dynamique, tests des hooks (ex: hooks fetching, `use-mobile`).
- Tests d'intégration front (Jest + Testing Library + MSW) : simuler API via `msw` (mock service worker) pour tester chargement de données et interactions réseau sans serveur réel.
- Tests e2e (Cypress) : vérifier navigation réelle dans l'app (ex. `/auth/projects/123`), interactions map (création d'un point), scénario utilisateur complet.

Notes techniques : Pour `jest`, la stratégie suivante est proposée : mocker la BDD de l'API (ou les modules d'API) et exécuter tous les tests sur ce mock. Les instructions sont fournis ci-dessous.

## 3.1 Stratégie de mocking
- Utiliser `msw` pour intercepter les requêtes HTTP du front pendant les tests unitaires et d'intégration, et pour simuler erreurs/latences.
- Mocker les bibliothèques de cartographie (Leaflet / leaflet-easyprint) : remplacer l'implémentation lourde par un stub minimal exposant API nécessaire (ex. `map.on`, `map.addLayer`, `L.marker`) afin de tester le rendu DOM et callbacks sans charger la vraie carte.
- Mocker les modules utilitaires non pertinents (`src/lib/auth-client.ts`, etc.) et isoler le code métier.

## 3.2 Mock DB de l'API + tests avec `jest`
Pour mocker la BDD de l'API et d'exécuter les tests avec `jest`, voici l'approche faite :

- Principe : remplacer l'accès réel à la BDD/backend par un mock contrôlé (implémentation en mémoire ou fixtures). Les tests exécutent l'app front (unitaires/integration) en pointant vers ces mocks (par `jest.mock` des modules d'API ou via `msw` en mode node).

- Avantages : tests rapides, pas de dépendance à une base locale, possibilité de simuler erreurs/latence/état précis.

- Deux méthodes :
  1. **Mock des modules d'API (module-level mocks)**
     - Créer des mocks pour `src/lib/api.ts` ou `src/api/*.ts` en utilisant `jest.mock()`.
     - Implémenter une version en mémoire de la BDD : fonctions `getProject(id)`, `listPoints(projectId)`, `createPoint(payload)`, etc., retournant/promettant des fixtures.
     - Avantage : simple, pas besoin d'intercepter le network.
  2. **MSW en mode node + fixtures**
     - Utiliser `msw/node` pour intercepter les appels fetch/XHR au niveau réseau et renvoyer des réponses basées sur une BDD en mémoire.
     - Avantage : test plus proche du comportement réseau réel (URL, headers, statuts), facile à réutiliser pour Vitest ou Jest.



## 4. Organisation des tests et fichiers 
- `tests/unit/components/*.test.tsx` — tests unitaires des composants UI.
- `tests/integration/routes/*.test.tsx` — tests utilisant `msw` pour les routes dynamiques.
- `tests/e2e/*.spec.ts` — Cypress pour scénarios complets.
- Helpers : `tests/setupTests.ts` (DOM, msw setup), `tests/mocks/mapStub.ts` (stub Leaflet), `tests/fixtures/*.json`.


## 5. Environnements / ressources
- Outils : `jest`, `@testing-library/react`, `msw`, `cypress`.
- Scripts : ajouter dans `package.json` si absent :

```powershell
npm run test:unit
npm run test:integration
npm run test:e2e
```


## 6. Commandes utiles (PowerShell)
```powershell
npm install
npm run test:unit
npm run test:integration
npm run test:e2e
```

