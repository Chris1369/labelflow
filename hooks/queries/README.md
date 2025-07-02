# React Query Hooks Usage Guide

Ces hooks React Query sont créés pour une utilisation future. Ils ne sont pas encore utilisés dans l'application qui utilise actuellement Zustand.

## Propriétés disponibles

Chaque hook retourne un objet avec toutes ces propriétés :

```typescript
const {
  data, // Les données récupérées
  error, // L'erreur si la requête a échoué
  isLoading, // true lors du premier chargement
  isFetching, // true pendant tout rechargement (incluant refetch)
  isSuccess, // true si la requête a réussi
  isError, // true si la requête a échoué
  refetch, // Fonction pour recharger manuellement
  isRefetching, // true pendant un refetch
  status, // 'loading' | 'error' | 'success'
  fetchStatus, // 'fetching' | 'paused' | 'idle'
} = useHook();
```

## Exemple d'utilisation future

```typescript
import { useCategories, useMyCategories } from '@/hooks/queries';

// Dans un composant
const CategoriesComponent = () => {
  // Récupérer toutes les catégories avec toutes les propriétés
  const {
    data: categories,
    isLoading,
    isFetching,
    error,
    refetch,
    isRefetching,
  } = useCategories();

  // Récupérer les catégories de l'utilisateur
  const { data: myCategories, refetch: refetchMyCategories } =
    useMyCategories(true);

  if (isLoading) return <ActivityIndicator />;
  if (error)
    return (
      <View>
        <Text>Erreur: {error.message}</Text>
        <Button title='Réessayer' onPress={() => refetch()} />
      </View>
    );

  return (
    <>
      {isRefetching && <Text>Mise à jour...</Text>}
      <FlatList
        data={categories}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        refreshing={isFetching}
        onRefresh={() => refetch()}
      />
    </>
  );
};
```

## Hooks disponibles

### Categories

- `useCategories()` - Toutes les catégories
- `useMyCategories(includePublic)` - Catégories de l'utilisateur
- `usePublicCategories()` - Catégories publiques uniquement
- `useCategoryDetails(id)` - Détails d'une catégorie

### Labels

- `useLabels()` - Tous les labels
- `useMyLabels(includePublic)` - Labels de l'utilisateur
- `usePublicLabels()` - Labels publics uniquement
- `useSearchLabels(query)` - Recherche de labels
- `useLabelDetails(id)` - Détails d'un label

### Projects

- `useProjects(filters)` - Tous les projets avec filtres
- `useMyProjects({includePublic, withTeamsProjects, searchQuery})` - Projets de l'utilisateur
- `useProjectsByOwner(ownerId)` - Projets par propriétaire
- `useProjectDetails(id)` - Détails d'un projet

### Teams

- `useTeams()` - Équipes de l'utilisateur
- `useTeamsByOwner(ownerId)` - Équipes par propriétaire
- `useTeamDetails(id)` - Détails d'une équipe
- `useTeamMembers(id)` - Membres d'une équipe
- `useTeamProjects(id)` - Projets d'une équipe

## Exemple avec useProjectDetails

```typescript
import { useProjectDetails } from '@/hooks/queries';

const ProjectScreen = ({ projectId }: { projectId: string }) => {
  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProjectDetails(projectId);

  // Utilisation dans des handlers
  const handleRefresh = async () => {
    const result = await refetch();
    if (result.isSuccess) {
      Alert.alert('Succès', 'Projet rechargé');
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    >
      {/* Contenu */}
    </ScrollView>
  );
};
```

## Options supplémentaires

Les hooks acceptent aussi des options React Query :

```typescript
const { data, refetch } = useProjectDetails(projectId, {
  enabled: !!projectId, // Activer/désactiver la requête
  staleTime: 5 * 60 * 1000, // Données considérées fraîches pendant 5 minutes
  cacheTime: 10 * 60 * 1000, // Garder en cache pendant 10 minutes
  refetchOnWindowFocus: true, // Recharger au focus
  refetchOnReconnect: true, // Recharger à la reconnexion
  retry: 3, // Nombre de tentatives en cas d'échec
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onSuccess: (data) => {
    console.log('Données chargées:', data);
  },
  onError: (error) => {
    console.error('Erreur:', error);
  },
});
```

## Note importante

Ces hooks gèrent automatiquement les réponses paginées et les tableaux directs grâce à la vérification :

```typescript
if (Array.isArray(result)) {
  return result;
}
return result.data || [];
```

## Avantages par rapport à Zustand

- **Cache automatique** : Les données sont mises en cache et partagées entre composants
- **Refetch intelligent** : Rechargement automatique selon les conditions
- **États de chargement** : `isLoading`, `isFetching`, `isRefetching` pour différents cas
- **Gestion d'erreur** : Retry automatique et gestion d'erreur intégrée
- **Synchronisation** : Les données sont synchronisées entre tous les composants
- **Performance** : Deduplication des requêtes et optimisations intégrées
