# Instructions spécifiques au projet Labeltool

## Architecture du projet

### Structure des dossiers
- **components/** : Composants réutilisables
  - **atoms/** : Composants de base (Button, Input, Select)
  - **molecules/** : Composants composés
  - **organisms/** : Composants complexes
  - **Règle importante** : Tout composant utilisé dans plus d'un endroit devient un atom/molecule/organism. Les composants exclusifs à une partie de l'UI restent dans leur dossier ui/

- **ui/** : Contenu et logique métier des pages
  - Chaque dossier de page contient au minimum :
    - `index.tsx` : Composant de la page (JAMAIS de state direct)
    - `actions.ts` : Actions et logique métier
    - `useStore.ts` : Store Zustand pour l'état

- **app/** : Routes expo-router (pas de dossier pages séparé)
  - Les pages sont directement dans app/
  - Utilisation des groupes avec parenthèses : `(auth)`, etc.

- **helpers/** : Fonctions utilitaires

- **types/** : Fichiers TypeScript de types

## Stack technique
- **Framework** : Expo avec expo-router
- **State Management** : Zustand (PAS de useState)
- **Navigation** : expo-router
- **Imports** : Utilisation des alias avec `@/` (configuré dans tsconfig.json)

## Règles de développement

### 1. State Management avec Zustand
```typescript
// Format obligatoire pour les stores
create<State & Actions>((set, get) => ({
  // state
  // actions
}));
```
- JAMAIS de useState dans les composants
- Toujours utiliser Zustand pour la gestion d'état

### 2. Composants
- Décomposer systématiquement les gros composants
- Utiliser les composants atoms pour les éléments simples (Button, Input)
- Créer un fichier de types pour chaque feature

### 3. Structure UI
- `index.tsx` : Uniquement l'UI, pas de logique ni de state
- `actions.ts` : Toute la logique métier
- `useStore.ts` : Gestion de l'état avec Zustand

### 3.1 Imports
- **Toujours utiliser les alias `@/`** pour les imports (ex: `import { theme } from '@/types/theme'`)
- Ne jamais utiliser les imports relatifs `../` ou `../../`

### 4. Thème et couleurs
- Primary : `#FF7557`
- Secondary : `#fff`
- Utiliser le fichier `types/theme.ts` pour toutes les valeurs de style

### 5. Règles de design et harmonisation
- **PAS de boutons flottants** : Éviter les éléments en position absolute/fixed
- **Cohérence visuelle** : Utiliser les mêmes styles de boutons et layouts dans toute l'app
- **Boutons secondaires** : Pour les actions non-principales (ex: quitter, annuler), utiliser un style discret avec `color: textSecondary`
- **Espacement cohérent** : Toujours utiliser les valeurs du theme.spacing
- **Maintenir l'aspect professionnel** : Éviter la multiplication des styles différents

## Fonctionnalités implémentées

### Authentification
1. **Page Sign In** (`/(auth)/signin`)
   - Email/Password
   - OAuth : Apple, Google
   
2. **Page Forget Password** (`/(auth)/forget-password`)
   - Envoi d'email
   - Code OTP 6 chiffres
   - Expiration : 10 minutes
   - Timer de renvoi : 60 secondes

### Menu Principal
3. **Page Home** (`/(main)/home`)
   - Menu avec 4 options : Créer projet, Sélectionner projet, Paramètres, Aide
   - Navigation vers les différents screens

### Gestion des Projets
4. **Page Select Project** (`/(main)/select-project`)
   - Liste des projets mockés
   - Recherche de projets
   - Navigation vers un projet spécifique

5. **Page Projet** (`/(project)/[id]`)
   - Menu avec 6 options : Ajouter items, Voir items, Exporter, Importer, Réinitialiser, Supprimer
   - Modal d'avertissement pour Reset et Delete (Alert native)

### Capture et Labellisation
6. **Page Add Items** (`/(project)/[id]/add-items`)
   - Demande de permission caméra
   - Capture de photo avec écran statique (l'image ne bouge pas)
   - Carré interactif avec :
     - Drag & drop (déplacement)
     - Redimensionnement via les coins (2 coins pour simplifier)
     - Rotation avec boutons -15°/+15° placés à côté du bouton valider
     - Affichage de l'angle de rotation et de la taille du carré
   - Au clic sur valider : ouverture d'un bottom sheet pour :
     - Sélectionner un label parmi 50+ objets mockés (organisés par catégories)
     - Rechercher un label
     - Ajouter un nouveau label personnalisé
   - Console.log du label et des coordonnées (centerX, centerY, width, height, rotation)

## Configuration multi-environnements

### app.config.ts
Le projet utilise `app.config.ts` au lieu de `app.json` pour permettre une configuration dynamique selon l'environnement :
- **Development** : `APP_VARIANT=development` - Pour le développement local
- **Staging** : `APP_VARIANT=staging` - Pour les tests pré-production
- **Production** : `APP_VARIANT=production` - Pour l'environnement de production

### Utilisation des environnements
```bash
# Development (par défaut)
npm start

# Staging
APP_VARIANT=staging npm start

# Production
APP_VARIANT=production npm start
```

### Variables d'environnement disponibles
- `BASE_URL` : URL de l'API selon l'environnement
- `VERSION` : Version de l'API
- `PROJECT_NAME` : Nom du projet API
- Package names différents par environnement pour installer plusieurs versions

### Accès aux variables dans le code
```typescript
import { getEnvironmentConfig } from '../helpers/environment';

const { apiUrl, environment, version } = getEnvironmentConfig();
```

## Commandes importantes
- `npm start` : Démarrer le projet
- `npx expo start -c` : Démarrer avec cache nettoyé
- `APP_VARIANT=staging npm start` : Démarrer en environnement staging
- `APP_VARIANT=production npm start` : Démarrer en environnement production

## Architecture API

### Structure des dossiers /api
- **axiosInstance.ts** : Configuration axios avec intercepteurs pour auth
- **responseHelper.ts** : Gestion standardisée des réponses et erreurs
- **baseAPI.ts** : Classe abstraite pour les opérations CRUD standard
- **auth.api.ts** : API d'authentification
- Autres APIs suivent le pattern : `[feature].api.ts`

### Pattern API standard
Chaque API suit généralement cette structure :
- `create` : POST - Créer une ressource
- `getAll` : GET - Récupérer toutes les ressources (avec pagination)
- `getOne` : GET - Récupérer une ressource par ID
- `update` : PUT - Mettre à jour une ressource
- `delete` : DELETE - Supprimer une ressource
- `other` : Pour les cas spéciaux

### StorageKeys
Toutes les clés AsyncStorage sont centralisées dans `helpers/StorageKeys.ts` :
- Préfixe : `@labeltool:`
- Auth : tokens, user data
- App : settings, préférences
- Cache : données mises en cache

### Types
- **auth.ts** : Types pour l'authentification (User, LoginRequest, etc.)
- **api.ts** : Types génériques API (ApiResponse, PaginatedResponse, etc.)

### Gestion des erreurs
- Intercepteur axios pour le refresh token automatique
- `handleApiError` pour formater les erreurs de manière cohérente
- Logout automatique si refresh token échoue

## Notes importantes
- Toujours créer des fichiers de types
- Pas de commentaires dans le code sauf si demandé
- Utiliser l'architecture définie strictement
- **IMPORTANT** : Quand l'utilisateur donne des informations utiles au projet, les ajouter automatiquement dans ce fichier CLAUDE.md pour maintenir la documentation à jour