# Instructions spécifiques au projet Labelflow

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
import { getEnvironmentConfig } from "../helpers/environment";

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

- Préfixe : `@labelflow:`
- Auth : tokens, user data
- App : settings, préférences
- Cache : données mises en cache

### Types

- **auth.ts** : Types pour l'authentification (User, LoginRequest, etc.)
- **api.ts** : Types génériques API (ApiResponse, PaginatedResponse, etc.)
- **project.ts** : Types pour les projets et items (Project, ProjectItem, etc.)

### Gestion des erreurs

- Intercepteur axios pour le refresh token automatique
- `handleApiError` pour formater les erreurs de manière cohérente
- Logout automatique si refresh token échoue

### APIs disponibles

- **auth.api.ts** : Authentification (login, register, logout, etc.)
- **project.api.ts** : CRUD des projets + méthodes spécifiques
- **projectItem.api.ts** : CRUD des items + upload, export, bulk operations

### Règles de création d'API

1. **Toujours étendre BaseAPI** pour les opérations CRUD standard
2. **Nommer les fichiers** : `[feature].api.ts`
3. **Structure du path** : `/[resource]` au pluriel (ex: `/projects`)
4. **Méthodes personnalisées** : Ajouter après les méthodes héritées
5. **Gestion d'erreurs** : Toujours utiliser `handleApiError` et `handleApiResponse`
6. **Types** : Créer les interfaces Request/Response dans `types/[feature].ts`

### Modèle de données côté API

- Les IDs sont des `ObjectId` MongoDB côté serveur
- Timestamps automatiques : `createdAt`, `updatedAt`
- Relations : Les items sont référencés par ID dans les projets
- Format de nom projet : `date-initials-company-index` (ex: 010225-DS-COMPANYNAME-001)

## Export de datasets

### Formats supportés

L'application supporte maintenant l'export de datasets labellisés dans 8 formats différents :

1. **YOLO** : Format texte standard pour la détection d'objets
2. **YOLOv8 OBB** : Format YOLO v8 avec support des bounding boxes orientées (rotation)
3. **JSON** : Export complet avec images et métadonnées
4. **JSON-MIN** : Export minimal sans images, uniquement les annotations
5. **CSV** : Format tabulaire avec séparateur virgule
6. **TSV** : Format tabulaire avec séparateur tab
7. **COCO** : Format JSON standard COCO pour la détection d'objets
8. **Pascal VOC** : Format XML Pascal VOC

### Sauvegarde de la rotation

Les bounding boxes sont maintenant sauvegardées avec 5 valeurs dans l'array position :

- `centerX` : Position X du centre (0-1)
- `centerY` : Position Y du centre (0-1)
- `width` : Largeur (0-1)
- `height` : Hauteur (0-1)
- `rotation` : Angle de rotation en degrés

Cette modification dans `/ui/add-items/actions.ts` permet de supporter les formats d'export qui gèrent les bounding boxes orientées comme YOLOv8 OBB.

### Téléchargement des exports

- Les exports sont générés de manière asynchrone côté serveur
- Un fichier ZIP est créé pour les formats nécessitant plusieurs fichiers (YOLO, COCO, etc.)
- Les fichiers JSON-MIN, CSV et TSV sont téléchargés directement sans ZIP
- Si un export du même type existe déjà pour un projet, il est automatiquement supprimé lors de la génération d'un nouvel export

## Système de fonts

### Rôles typographiques

Le système de fonts utilise 6 rôles distincts avec des usages spécifiques :

1. **title** (28px, 700, lh: 36)
   - Titres principaux des pages
   - Headers de sections importantes
   - Exemples : "Sélectionner un projet", "Ajouter des items"

2. **subtitle** (20px, 600, lh: 28)
   - Sous-titres et sections secondaires
   - Noms de projets dans les listes
   - Headers de modals et bottom sheets
   - Exemples : Nom du projet, titres de catégories

3. **body** (16px, 400, lh: 24)
   - Texte principal et contenu
   - Descriptions et paragraphes
   - Texte des inputs et champs
   - Exemples : Description de projet, texte d'aide

4. **caption** (14px, 400, lh: 20)
   - Textes secondaires et informatifs
   - Hints et placeholders
   - Métadonnées (dates, compteurs)
   - Exemples : "Centrez votre objet ici", nombre d'items

5. **button** (16px, 600, lh: 24)
   - Texte des boutons principaux
   - Actions importantes
   - Exemples : "Valider", "Ajouter", "Enregistrer"

6. **label** (12px, 600, lh: 16)
   - Labels de formulaires
   - Tags et badges
   - Textes très courts et compacts
   - Exemples : Labels d'objets, tags de catégories

### Utilisation dans les composants

```typescript
import { theme } from '@/types/theme';

// Titre principal
<Text style={theme.fonts.title}>Ajouter des items</Text>

// Sous-titre
<Text style={theme.fonts.subtitle}>Sélectionnez une catégorie</Text>

// Corps de texte
<Text style={theme.fonts.body}>Description du projet...</Text>

// Caption/info
<Text style={theme.fonts.caption}>10 items ajoutés</Text>

// Bouton
<Text style={theme.fonts.button}>Valider</Text>

// Label
<Text style={theme.fonts.label}>Coussin</Text>
```

### Règles d'application

- **Cohérence** : Toujours utiliser le même rôle pour le même type de contenu
- **Hiérarchie** : Respecter la hiérarchie visuelle (title > subtitle > body > caption)
- **Lisibilité** : Ne jamais utiliser label pour du texte long
- **Contexte** : Adapter le rôle au contexte (un nom de projet est un subtitle, pas un title)

## Système de gestion des erreurs

### Architecture

1. **ErrorBoundary** (`/helpers/errorBoundary.tsx`)
   - Capture les erreurs React au niveau global
   - Affiche une interface de récupération
   - Sauvegarde les erreurs dans AsyncStorage

2. **ErrorHandler** (`/helpers/errorHandler.ts`)
   - Singleton pour la gestion centralisée des erreurs
   - Types d'erreurs : api, navigation, state, render, unknown
   - Intercepte console.error et les promesses rejetées
   - Sauvegarde jusqu'à 50 erreurs en local

3. **ErrorDebugPanel** (`/components/organisms/ErrorDebugPanel.tsx`)
   - Panneau de debug flottant (dev uniquement)
   - Affiche le nombre d'erreurs avec un badge
   - Permet de voir le détail de chaque erreur
   - Bouton pour effacer les logs

### Utilisation

#### Dans les composants
```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

const { handleError, wrapAsync } = useErrorHandler('ComponentName');

// Pour wrapper une fonction async
const loadData = wrapAsync(async () => {
  const data = await api.getData();
  return data;
});
```

#### Dans les actions
```typescript
import { createSafeAction } from '@/helpers/safeAction';

const safeAction = createSafeAction(
  async () => {
    // Code qui peut lancer une erreur
  },
  {
    showAlert: true,
    alertTitle: 'Erreur',
    componentName: 'ActionName'
  }
);
```

#### Accès au debug en développement
- Un bouton flottant 🐛 apparaît en bas à droite
- Badge rouge avec le nombre d'erreurs
- Cliquer pour voir les détails
- Console: `showErrorDebug()` pour ouvrir le panneau

### Intégration API

Les erreurs API sont automatiquement capturées par :
- `axiosInstance` : Intercepteurs pour requêtes/réponses
- `responseHelper` : handleApiError log automatiquement
- Affichage d'alertes user-friendly en production

## Notes importantes

- Toujours créer des fichiers de types
- Pas de commentaires dans le code sauf si demandé
- Utiliser l'architecture définie strictement
- **IMPORTANT** : Quand l'utilisateur donne des informations utiles au projet, les ajouter automatiquement dans ce fichier CLAUDE.md pour maintenir la documentation à jour
