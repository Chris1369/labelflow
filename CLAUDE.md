# Instructions spécifiques au projet Labelflow

## Architecture du projet

### Structure complète des dossiers

```
labelflow-app/
├── api/                    # Couche API avec axios
├── app/                    # Routes expo-router
├── assets/                 # Ressources statiques (fonts, images, icons)
├── components/             # Composants réutilisables (Atomic Design)
├── contexts/               # Contextes React (AuthContext)
├── helpers/                # Utilitaires et fonctions helpers
├── hooks/                  # Hooks personnalisés (useErrorHandler, etc.)
├── mock/                   # Données mockées pour dev
├── types/                  # Types TypeScript centralisés
├── ui/                     # Logique métier des écrans
├── app.config.ts           # Configuration multi-environnements
├── package.json            # Dépendances NPM
├── tsconfig.json           # Configuration TypeScript avec alias @/
├── babel.config.js         # Configuration Babel
└── CLAUDE.md               # Documentation projet
```

### Organisation des composants (Atomic Design)

- **components/** : Composants réutilisables suivant l'Atomic Design

  - **atoms/** : Composants de base indivisibles
    - `Button.tsx` : Bouton configurable (primary, secondary, outline)
    - `Input.tsx` : Champ de saisie réutilisable
    
  - **molecules/** : Composants composés d'atoms
    - `DraggableBox.tsx` : Boîte déplaçable
    - `FixedBoundingBox.tsx` : Boîte de délimitation fixe
    - `InteractiveBoundingBox.tsx` : Boîte interactive avec gestion tactile
    - `SimpleBoundingBox.tsx` : Boîte simple pour affichage
    - `SimpleDraggableBox.tsx` : Boîte déplaçable simplifiée
    - `StableBoundingBox.tsx` : Boîte stable pour labellisation avec rotation
    
  - **organisms/** : Composants complexes autonomes
    - `ErrorDebugPanel.tsx` : Panneau de debug des erreurs (dev only)
    - `LabelBottomSheet.tsx` : Modal pour sélection de labels (utilise Modal, pas BottomSheet)
    - `ProtectedRoute.tsx` : Route protégée par authentification
    
  - **Règle importante** : Tout composant utilisé dans plus d'un endroit devient un atom/molecule/organism. Les composants exclusifs à une partie de l'UI restent dans leur dossier ui/

### Structure UI (Logique métier)

- **ui/** : Contenu et logique métier des pages

  - Chaque dossier de page contient au minimum :
    - `index.tsx` : Composant de la page (JAMAIS de state direct, uniquement UI)
    - `actions.ts` : Actions et logique métier (API calls, transformations)
    - `useStore.ts` : Store Zustand pour l'état local
    
  - Dossiers existants :
    - `auth/` : Écrans d'authentification
    - `home/` : Menu principal regroupé
    - `create-project/` : Formulaire de création de projet
    - `select-project/` : Liste et sélection de projets (avec bouton + flottant)
    - `create-team/` : Formulaire de création d'équipe
    - `select-team/` : Liste et sélection d'équipes (avec bouton + flottant)
    - `project/` : Écran principal d'un projet
    - `team/` : Écran principal d'une équipe
    - `team-members/` : Gestion des membres d'équipe
    - `team-projects/` : Gestion des projets d'équipe
    - `add-items/` : Logique de capture et labellisation
    - `view-items/` : Visualisation des items
    - `export/` : Export de données
    - `import/` : Import de données
    - `categories/` : Gestion des catégories
    - `labels/` : Gestion des labels
    - `dictionary/` : Dictionnaire de labels
    - `settings/` : Paramètres application

### Routes et navigation (expo-router)

- **app/** : Routes expo-router avec structure de groupes

  - **Groupes de routes** :
    - `(auth)/` : Routes d'authentification
      - `signin.tsx` : Connexion
      - `signup.tsx` : Inscription
      - `forget-password.tsx` : Récupération mot de passe
      
    - `(main)/` : Routes principales
      - `home.tsx` : Menu principal
      - `create-project.tsx` : Création de projet
      - `select-project.tsx` : Sélection de projet
      - `create-team.tsx` : Création d'équipe
      - `select-team.tsx` : Sélection d'équipe
      - `categories.tsx` : Gestion des catégories
      - `labels.tsx` : Gestion des labels
      - `dictionary.tsx` : Dictionnaire de labels
      - `settings.tsx` : Paramètres
      - `help.tsx` : Aide
      
    - `(project)/` : Routes projet avec paramètres dynamiques
      - `[id].tsx` : Vue projet
      - `[id]/add-items.tsx` : Ajout d'items avec caméra
      - `[id]/view-items.tsx` : Visualisation des items
      - `[id]/export.tsx` : Export de données
      - `[id]/import.tsx` : Import de données
      
    - `(team)/` : Routes équipe
      - `[id].tsx` : Vue équipe
      - `[id]/members.tsx` : Gestion des membres
      - `[id]/projects.tsx` : Projets de l'équipe

### Couche API

- **api/** : Gestion centralisée des appels API

  - **Architecture de base** :
    - `axiosInstance.ts` : Instance axios avec intercepteurs (auth, refresh token)
    - `responseHelper.ts` : Helpers pour réponses/erreurs standardisées
    - `baseAPI.ts` : Classe abstraite pour CRUD générique
    
  - **APIs métier** :
    - `auth.api.ts` : Authentification (login, register, refresh, logout, OTP)
    - `project.api.ts` : CRUD projets + méthodes spécifiques
    - `projectItem.api.ts` : CRUD items + upload images, export, bulk operations
    - `team.api.ts` : CRUD équipes + gestion membres, invitations
    - `category.api.ts` : CRUD catégories de labels
    - `label.api.ts` : CRUD labels personnalisés
    - `export.api.ts` : Gestion des exports (8 formats)

### Types TypeScript

- **types/** : Définitions TypeScript centralisées

  - **Types génériques** :
    - `api.ts` : ApiResponse, PaginatedResponse, QueryParams, ErrorResponse
    - `theme.ts` : Thème global (colors, spacing, fonts, shadows)
    
  - **Types métier** :
    - `auth.ts` : User, AuthTokens, LoginRequest, RegisterRequest, OTPRequest
    - `project.ts` : Project, ProjectItem, BoundingBoxPosition (avec rotation)
    - `team.ts` : Team, TeamMember, TeamInvitation, TeamRole
    - `category.ts` : Category, CategoryWithLabels
    - `label.ts` : Label, LabelWithCategory, RecentLabel
    - `export.ts` : ExportFormat (8 types), ExportRequest, ExportStatus
    - `camera.ts` : CameraState, BoundingBox, ImageMetadata

### Helpers et utilitaires

- **helpers/** : Fonctions utilitaires réutilisables

  - **Gestion d'erreurs** :
    - `errorHandler.ts` : Singleton pour gestion centralisée
    - `errorBoundary.tsx` : Capture erreurs React globalement
    - `safeAction.ts` : Wrapper pour actions sécurisées
    
  - **Storage et données** :
    - `StorageKeys.ts` : Clés AsyncStorage centralisées (@labelflow:*)
    - `recentLabels.ts` : Gestion des labels récemment utilisés
    - `labelColors.ts` : Palette de couleurs pour labels
    
  - **Utilitaires** :
    - `validation.ts` : Règles de validation (email, password, etc.)
    - `imageResizer.ts` : Redimensionnement d'images pour upload
    - `environment.ts` : Accès aux variables d'environnement

### Contextes et hooks

- **contexts/** :
  - `AuthContext.tsx` : Contexte d'authentification global
  
- **hooks/** :
  - `useErrorHandler.ts` : Hook pour gestion d'erreurs dans composants
  - Autres hooks custom selon besoins

### Assets et ressources

- **assets/** :
  - **fonts/** : Police Outfit (9 variantes de 100 à 900)
  - **images/** : Logo, splash screen, illustrations
  - **adaptive-icon.png** : Icône adaptive Android
  - Configuration expo pour permissions (caméra, galerie)

### Mocks et données de test

- **mock/** :
  - Données mockées pour développement
  - Labels et catégories prédéfinis
  - Projets et équipes de test

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
   - Menu avec 4 options : Projets, Équipes, Dictionnaire, Paramètres
   - Navigation vers les écrans de sélection avec boutons flottants pour création

### Gestion des Projets

4. **Page Select Project** (`/(main)/select-project`)

   - Liste des projets de l'utilisateur
   - Recherche de projets
   - Navigation vers un projet spécifique
   - Bouton flottant + pour créer un nouveau projet

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
- **team.api.ts** : Gestion des équipes avec méthode `updateProjects` pour ajout/suppression en masse
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

### APIs disponibles et leurs méthodes

- **auth.api.ts** : Authentification
  - `login(email, password)` : Connexion utilisateur
  - `register(userData)` : Inscription
  - `logout()` : Déconnexion
  - `refreshToken()` : Renouvellement token
  - `forgotPassword(email)` : Envoi OTP
  - `verifyOTP(email, otp)` : Vérification code
  - `resetPassword(email, otp, newPassword)` : Réinitialisation
  
- **project.api.ts** : Gestion des projets
  - CRUD standard hérité de BaseAPI
  - `getByUser()` : Projets de l'utilisateur
  - `getByTeam(teamId)` : Projets d'une équipe
  - `addMember(projectId, userId)` : Ajouter membre
  - `removeMember(projectId, userId)` : Retirer membre
  - `updateSettings(projectId, settings)` : MAJ paramètres
  
- **projectItem.api.ts** : Gestion des items
  - CRUD standard hérité de BaseAPI
  - `uploadImage(projectId, image, metadata)` : Upload avec metadata
  - `bulkCreate(projectId, items[])` : Création en masse
  - `bulkUpdate(projectId, updates[])` : MAJ en masse
  - `bulkDelete(projectId, itemIds[])` : Suppression en masse
  - `getByProject(projectId, filters)` : Items filtrés
  
- **team.api.ts** : Gestion des équipes
  - CRUD standard hérité de BaseAPI
  - `addMember(teamId, email)` : Ajouter membre par email
  - `inviteMembers(teamId, emails[])` : Inviter plusieurs membres
  - `removeMember(teamId, userId)` : Retirer membre
  - `getMyTeams()` : Équipes de l'utilisateur
  - `getTeamsByOwnerId(ownerId)` : Équipes par propriétaire
  - `getTeamMembers(teamId)` : Liste des membres
  - `getTeamProjects(teamId)` : Projets de l'équipe
  - `addProject(teamId, projectId)` : Ajouter projet
  - `removeProject(teamId, projectId)` : Retirer projet
  - `updateProjects(teamId, action, projectIds[])` : Ajouter ou supprimer plusieurs projets en masse
  
- **category.api.ts** : Gestion des catégories
  - CRUD standard hérité de BaseAPI
  - `getWithLabels()` : Catégories avec leurs labels
  - `reorderCategories(categoryIds[])` : Réordonner
  
- **label.api.ts** : Gestion des labels
  - CRUD standard hérité de BaseAPI
  - `getByCategory(categoryId)` : Labels d'une catégorie
  - `searchLabels(query)` : Recherche de labels
  - `getUserLabels()` : Labels personnalisés utilisateur
  
- **export.api.ts** : Export de données
  - `requestExport(projectId, format)` : Demander export
  - `getExportStatus(exportId)` : Statut export
  - `downloadExport(exportId)` : Télécharger fichier
  - `listExports(projectId)` : Liste des exports
  - `deleteExport(exportId)` : Supprimer export

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

## Patterns et conventions de code

### Gestion d'état avec Zustand

- **Pattern strict** : `create<State & Actions>((set, get) => ({...}))`
- **Organisation** : 
  - État en premier
  - Actions ensuite
  - Utiliser `get()` pour accéder à l'état dans les actions
- **Nommage** : 
  - Actions : verbes (setUser, updateProject, resetForm)
  - État : noms (user, projects, isLoading)

### Structure des actions

```typescript
// Pattern pour actions.ts
import { createSafeAction } from '@/helpers/safeAction';
import { api } from '@/api/[feature].api';
import { useStore } from './useStore';

export const loadData = createSafeAction(
  async () => {
    const store = useStore.getState();
    store.setLoading(true);
    
    const data = await api.getData();
    store.setData(data);
    
    store.setLoading(false);
  },
  { 
    showAlert: true,
    componentName: 'FeatureName'
  }
);
```

### Conventions de nommage

- **Fichiers** : camelCase pour .ts/.tsx, PascalCase pour composants
- **Dossiers** : kebab-case
- **Types** : PascalCase, préfixe I pour interfaces si nécessaire
- **Constantes** : UPPER_SNAKE_CASE
- **Stores Zustand** : toujours nommés `useStore.ts`

### Imports et exports

- **Toujours** utiliser l'alias `@/`
- **Ordre des imports** :
  1. React/React Native
  2. Bibliothèques tierces
  3. Composants
  4. Helpers/Utils
  5. Types
  6. Assets/Styles

### Gestion des erreurs

- Utiliser `createSafeAction` pour toutes les actions async
- Utiliser `useErrorHandler` dans les composants
- Toujours typer les erreurs avec ErrorResponse
- Logger en dev, alertes user-friendly en prod

### Performance

- Mémoriser les composants lourds avec React.memo
- Utiliser useCallback/useMemo judicieusement
- Lazy loading pour les routes avec React.lazy
- Optimiser les images avec imageResizer avant upload

## Architecture décisionnelle

### Où placer un nouveau fichier ?

1. **C'est un composant réutilisable ?** → `components/[atomic-level]/`
2. **C'est spécifique à un écran ?** → `ui/[feature]/`
3. **C'est un type partagé ?** → `types/`
4. **C'est une fonction utilitaire ?** → `helpers/`
5. **C'est un appel API ?** → `api/`
6. **C'est une route ?** → `app/`

### Quand créer un nouveau composant ?

- Utilisé dans 2+ endroits → Devient atom/molecule/organism
- Logique complexe → Séparer en composant
- Plus de 100 lignes → Décomposer
- Besoin de tests isolés → Composant séparé

### Choix du niveau atomique

- **Atom** : Aucune dépendance, état minimal, pure UI
- **Molecule** : Combine des atoms, logique simple
- **Organism** : Autonome, logique métier, peut faire des API calls

## Fonctionnalités avancées implémentées

### Système de permissions

- Gestion des rôles dans les équipes (owner, admin, member, viewer)
- Permissions granulaires par projet
- Vérification côté client et serveur

### Optimisations

- Cache des images avec AsyncStorage
- Pagination automatique des listes
- Debounce sur les recherches
- Lazy loading des composants lourds

### Sécurité

- Tokens JWT avec rotation automatique
- Validation des inputs côté client
- Sanitization des données utilisateur
- HTTPS obligatoire en production

### Accessibilité

- Support des lecteurs d'écran
- Navigation au clavier
- Contrastes respectant WCAG 2.1
- Labels ARIA appropriés

## Debugging et monitoring

### Outils de développement

- **Error Debug Panel** : Panneau flottant en dev
- **Console helpers** : 
  - `showErrorDebug()` : Ouvre le panneau d'erreurs
  - `clearErrors()` : Vide les logs d'erreurs
- **React DevTools** : Support complet
- **Expo DevTools** : Intégration native

### Logs et métriques

- Logs structurés par niveau (error, warn, info, debug)
- Métriques de performance (temps de chargement, FPS)
- Tracking des erreurs en production (à implémenter)

## Roadmap technique

### Prochaines étapes

1. Intégration de tests (Jest, React Testing Library)
2. CI/CD avec GitHub Actions
3. Monitoring en production (Sentry)
4. Optimisation du bundle size
5. Support offline complet
6. Internationalisation (i18n)

## Documentation API Backend

### Accès à la documentation
- **Swagger UI** : http://localhost:3000/v1.0/labelflow-api/api-docs
- **Base URL** : 
  - Development : `http://localhost:3000/v1.0/labelflow-api`
  - Staging/Production : Configuré via `BASE_URL`

### Routes API complètes

#### 🔐 Authentication (`/auth`)
- `POST /auth/login` - Connexion utilisateur
  - Body: `{ email: string, password: string }`
  - Retourne: `{ user, accessToken, refreshToken }`
  
- `GET /auth/login` - Obtenir les infos de l'utilisateur authentifié
  - Headers: `Authorization: Bearer {token}`
  
- `POST /auth/register` - Inscription nouveau utilisateur
  - Body: `{ email: string, password: string, username: string }`
  - Retourne: `{ user, accessToken, refreshToken }`
  
- `GET /auth/me` - Obtenir l'utilisateur actuellement connecté
  - Headers: `Authorization: Bearer {token}`
  
- `POST /auth/refresh-token` - Rafraîchir le token JWT
  - Body: `{ refreshToken: string }`
  
- `POST /auth/requestResetPassword` - Demander une réinitialisation de mot de passe
  - Body: `{ email: string }`
  
- `POST /auth/resetPassword` - Réinitialiser le mot de passe
  - Body: `{ token: string, password: string }`

#### 👤 Users (`/users`)
- `GET /users` - Liste des utilisateurs
  - Query: `page, limit, search`
  
- `GET /users/:id` - Obtenir un utilisateur
- `PUT /users/:id` - Mettre à jour un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur
- `PUT /users/:id/password` - Changer le mot de passe
  - Body: `{ oldPassword, newPassword }`
  
- `GET /users/:id/lastPendingProject` - Dernier projet en cours

#### 📁 Projects (`/projects`)
- `GET /projects` - Liste de tous les projets
  - Query: `page, limit, search, getIsPublic`
  
- `POST /projects` - Créer un nouveau projet
  - Body: `{ name, description, items[], ownerId, isPublic? }`
  
- `GET /projects/{id}` - Obtenir un projet par ID
- `PUT /projects/{id}` - Mettre à jour un projet
- `DELETE /projects/{id}` - Supprimer un projet
- `GET /projects/owner/{ownerId}` - Obtenir tous les projets d'un propriétaire

#### 📸 Project Items (`/project-items`)
- `GET /project-items` - Obtenir tous les items de projet
- `POST /project-items` - Créer un nouvel item avec upload de fichier
  - Body: FormData avec image + `{ projectId, labels[{ name, position[] }] }`
  - Position: `[centerX, centerY, width, height, rotation]`
  
- `GET /project-items/{id}` - Obtenir un item par ID
- `PUT /project-items/{id}` - Mettre à jour un item
- `DELETE /project-items/{id}` - Supprimer un item
- `GET /project-items/{id}/image-url` - Obtenir l'URL de l'image pour un item
- `GET /project-items/project/{projectId}` - Obtenir tous les items d'un projet

#### 🏷️ Labels (`/labels`)
- `GET /labels` - Obtenir tous les labels
- `POST /labels` - Créer un nouveau label
  - Body: `{ name, ownerId, isPublic? }`
  
- `GET /labels/{id}` - Obtenir un label par ID
- `PUT /labels/{id}` - Mettre à jour un label
- `DELETE /labels/{id}` - Supprimer un label
- `GET /labels/owner/{ownerId}` - Obtenir tous les labels d'un propriétaire

#### 📂 Categories (`/categories`)
- `GET /categories` - Obtenir toutes les catégories
- `POST /categories` - Créer une nouvelle catégorie
  - Body: `{ name, labels[]?, ownerId, isPublic? }`
  
- `GET /categories/{id}` - Obtenir une catégorie par ID
- `PUT /categories/{id}` - Mettre à jour une catégorie
- `DELETE /categories/{id}` - Supprimer une catégorie
- `PUT /categories/{id}/labels/{labelId}` - Ajouter un label à une catégorie
- `GET /categories/owner/{ownerId}` - Obtenir toutes les catégories d'un propriétaire

#### 📤 Exports (`/exports`)
- `GET /exports` - Obtenir tous les exports
- `POST /exports` - Créer un nouvel export
  - Body: `{ ownerId, fromProjectId, type }`
  - Types: `yolo, yolo-v8-obb, json, json-min, csv, tsv, coco, pascal-voc`
  
- `GET /exports/{id}` - Obtenir un export par ID
- `PUT /exports/{id}` - Mettre à jour un export
- `DELETE /exports/{id}` - Supprimer un export

#### 👥 Teams (`/teams`)
- `GET /teams` - Obtenir toutes les équipes
- `POST /teams` - Créer une nouvelle équipe
  - Body: `{ name, projectId[], description, members[], ownerId }`
  
- `GET /teams/{id}` - Obtenir une équipe par ID
- `PUT /teams/{id}` - Mettre à jour une équipe
- `DELETE /teams/{id}` - Supprimer une équipe
- `GET /teams/owner/{ownerId}` - Obtenir toutes les équipes d'un propriétaire
- `GET /teams/{id}/projects` - Obtenir tous les projets d'une équipe
- `POST /teams/{id}/add-member` - Ajouter un membre à l'équipe
  - Body: `{ email: string }`
  - Vérifie: existence équipe, utilisateur par email, canBeAddedToTeam, pas déjà membre
  - Erreur 403: Si l'utilisateur a `canBeAddedToTeam: false`
  
- `GET /teams/{id}/members` - Obtenir les membres de l'équipe

#### 💰 Options (`/options`) - Gestion des options de tarification
- `GET /options` - Obtenir toutes les options
- `POST /options` - Créer une nouvelle option
- `GET /options/{id}` - Obtenir une option par ID
- `PUT /options/{id}` - Mettre à jour une option
- `DELETE /options/{id}` - Supprimer une option

#### 🛒 Orders (`/orders`) - Gestion des commandes
- `GET /orders` - Obtenir toutes les commandes
- `POST /orders` - Créer une nouvelle commande
- `GET /orders/{id}` - Obtenir une commande par ID
- `PUT /orders/{id}` - Mettre à jour une commande
- `DELETE /orders/{id}` - Supprimer une commande

#### 💡 Recommendations (`/recommendations`) - Gestion des recommandations
- `GET /recommendations` - Obtenir toutes les recommandations
- `POST /recommendations` - Créer une nouvelle recommandation
- `GET /recommendations/{id}` - Obtenir une recommandation par ID
- `PUT /recommendations/{id}` - Mettre à jour une recommandation
- `DELETE /recommendations/{id}` - Supprimer une recommandation

### Notes sur l'API
- **Authentication** : Token JWT requis dans header `Authorization: Bearer {token}`
- **Pagination** : Paramètres `page` et `limit` sur toutes les listes
- **Recherche** : Paramètre `search` disponible sur la plupart des GET
- **Upload** : Images via multipart/form-data
- **Positions** : Format `[centerX, centerY, width, height, rotation]` (valeurs 0-1)
- **Exports** : Génération asynchrone, téléchargement après traitement
- **Format des paramètres** : Les IDs dans les routes utilisent `{id}` au lieu de `:id`

## Gestion des permissions utilisateur

### canBeAddedToTeam

Les utilisateurs ont une propriété `canBeAddedToTeam` qui contrôle s'ils peuvent être ajoutés aux équipes :

- **true** : L'utilisateur peut être ajouté aux équipes
- **false** : L'utilisateur ne peut pas être ajouté (erreur 403)

#### Implémentation côté front

1. **Vérifier avant l'ajout** :
```typescript
if (user.canBeAddedToTeam) {
  // Permettre l'ajout à l'équipe
}
```

2. **Gérer l'erreur 403** :
```typescript
if (error?.response?.status === 403) {
  // Message: "Cet utilisateur n'autorise pas l'ajout aux équipes"
}
```

3. **Permettre la mise à jour du profil** :
```typescript
await userAPI.update(userId, {
  canBeAddedToTeam: true
});
```

### Gestion des erreurs d'ajout de membres

Le front gère automatiquement les différents cas d'erreur :
- **403** : L'utilisateur n'autorise pas l'ajout aux équipes
- **404** : Utilisateur ou équipe non trouvée
- **409** : L'utilisateur est déjà membre de l'équipe
- Autres erreurs : Message générique ou message du serveur

## Notes importantes

- Toujours créer des fichiers de types
- Pas de commentaires dans le code sauf si demandé
- Utiliser l'architecture définie strictement
- Respecter les patterns établis
- Performance et UX avant tout
- **IMPORTANT** : Quand l'utilisateur donne des informations utiles au projet, les ajouter automatiquement dans ce fichier CLAUDE.md pour maintenir la documentation à jour
