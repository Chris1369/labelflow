# Projet Labelflow - Documentation technique

## Architecture

### Structure des dossiers

```
labelflow-app/
├── api/           # Couche API avec axios
├── app/           # Routes expo-router
├── assets/        # Ressources (fonts, images)
├── components/    # Atomic Design (atoms/molecules/organisms)
├── contexts/      # React contexts
├── helpers/       # Utilitaires
├── hooks/         # Hooks custom et React Query
├── mock/          # Données test
├── types/         # Types TypeScript
├── ui/            # Logique métier des écrans
└── app.config.ts  # Config multi-environnements
```

### Composants (Atomic Design)

- **atoms/** : Button, Input, HeaderPage
- **molecules/** : BoundingBoxes (Draggable, Fixed, Interactive, Simple, Stable)
- **organisms/** : ErrorDebugPanel, LabelBottomSheet (Modal), ProtectedRoute
- **Règle** : Composant réutilisé 2+ fois = atom/molecule/organism

### Structure UI

Chaque dossier UI contient :

- `index.tsx` : UI pure (pas de state)
- `(components)` : Composants utilisés dans l'écran
- `actions.ts` : Logique métier
- `useStore.ts` : State Zustand

### Routes expo-router

- `(auth)/` : signin, signup, forget-password
- `(main)/` : home, create/select-project/team, categories, labels, dictionary, settings
- `(project)/[id]/` : vue projet, add/view-items, export/import
- `(team)/[id]/` : vue équipe (membres et projets via bottom sheets)

## Stack technique

- **Framework** : Expo avec expo-router
- **State** : Zustand (JAMAIS useState)
- **API** : Axios avec intercepteurs auth
- **React Query** : Gestion des données serveur
- **Imports** : Alias `@/` obligatoire

## Règles strictes

### 1. State Management

```typescript
create<State & Actions>((set, get) => ({
  // state
  // actions
}));
```

### 2. Structure des fichiers

- Décomposer composants > 100 lignes
- Types dans fichiers séparés
- Actions dans `actions.ts`
- UI dans `index.tsx`

### 3. Conventions

- **Imports** : Toujours `@/`, jamais relatifs
- **Thème** : Primary `#FF7557`, theme.ts pour styles
- **Nommage** : camelCase fichiers, PascalCase composants, kebab-case dossiers
- **Pas de boutons flottants** : UI cohérente et professionnelle

## API Architecture

### Pattern standard

- BaseAPI pour CRUD
- `[feature].api.ts` pour chaque domaine
- handleApiError/Response obligatoire
- Types dans `types/[feature].ts`

### APIs principales

- **auth** : login, register, OTP, refresh
- **project** : CRUD + getByUser/Team
- **projectItem** : CRUD + upload, bulk ops
- **team** : CRUD + membres, updateProjects (masse)
- **category/label** : CRUD + recherche
- **export** : 8 formats (YOLO, COCO, JSON, CSV, etc.)
- **unlabeledList** : Upload images en masse

### Bounding Box

Position array : `[centerX, centerY, width, height, rotation]` (0-1)

## React Query

### Query Keys Pattern

```typescript
export const entityKeys = {
  all: ["entity"] as const,
  lists: () => [...entityKeys.all, "list"] as const,
  list: (filters?: any) => [...entityKeys.lists(), { filters }] as const,
  details: () => [...entityKeys.all, "detail"] as const,
  detail: (id: string) => [...entityKeys.details(), id] as const,
};
```

### Hooks conventions

- `useEntities` : Liste complète
- `useEntityDetails` : Par ID
- `useMyEntities` : De l'utilisateur
- Paramètre `enabled` optionnel

## Gestion erreurs

### ErrorHandler

- Singleton centralisé
- Types : api, navigation, state, render
- Debug panel en dev
- `createSafeAction` pour actions async
- `useErrorHandler` dans composants

## Fonts système

- **title** : 28px/700 - Titres pages
- **subtitle** : 20px/600 - Sections
- **body** : 16px/400 - Contenu
- **caption** : 14px/400 - Info secondaire
- **button** : 16px/600 - Actions
- **label** : 12px/600 - Tags

## Composants clés

### HeaderPage

```typescript
<HeaderPage
  title='Titre'
  subtitle='Description'
  rightAction={{ icon: "add", onPress: handler }}
/>
```

### SimpleBottomSheet

- Modal native React Native
- Gestion clavier automatique
- Handle visuel standard
- Hauteur max 90%

## Équipes

### Membres

- Avatars avec initiales (username > name > email)
- Rôles : owner (orange), admin (bleu), member (gris)
- Owner = team.ownerId, non supprimable
- Gestion via TeamMembersBottomSheet

### Projets

- Sélection multiple
- Sauvegarde en masse avec updateProjects
- Gestion via TeamProjectsBottomSheet

## Permissions

- `canBeAddedToTeam` : Contrôle ajout aux équipes
- Erreur 403 si false
- Gestion automatique des erreurs

## Environnements

```bash
npm start                        # Dev
APP_VARIANT=staging npm start    # Staging
APP_VARIANT=production npm start # Prod
```

## Notes importantes

- Pas de commentaires code
- Architecture stricte obligatoire
- Performance et UX prioritaires
- Mettre à jour CLAUDE.md si nouvelles infos projet
