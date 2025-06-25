import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { useViewItemsStore } from "./useStore";
import { ProjectItem } from "@/types/project";
import { ViewItemsScreenProps } from "./types";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - theme.spacing.lg * 3) / 2;

export const ViewItemsScreen: React.FC<ViewItemsScreenProps> = ({
  projectId,
}) => {
  const {
    items,
    isLoading,
    error,
    hasMore,
    setProjectId,
    loadItems,
    loadMoreItems,
    reset,
  } = useViewItemsStore();

  useEffect(() => {
    setProjectId(projectId);
    loadItems(true);

    return () => {
      reset();
    };
  }, [projectId]);

  const renderItem = ({ item }: { item: ProjectItem }) => (
    <TouchableOpacity style={styles.itemCard} activeOpacity={0.9}>
      <Image
        source={{ uri: item.fileUrl }}
        style={styles.itemImage}
        resizeMode='cover'
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemLabel} numberOfLines={1}>
          {item.labels.map(label => label.name).join(', ')}
        </Text>
        {item.labels && item.labels.length > 0 && (
          <Text style={styles.itemPositionCount}>
            {item.labels.length} label
            {item.labels.length > 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size='small' color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name='images-outline'
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyText}>Aucun item dans ce projet</Text>
        <Text style={styles.emptySubtext}>
          Commencez par ajouter des images à votre projet
        </Text>
      </View>
    );
  };

  const handleRefresh = () => {
    loadItems(true);
  };

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name='alert-circle' size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadItems(true)}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  console.log(JSON.stringify(items, null, 2));
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Items du projet</Text>
        <Text style={styles.subtitle}>
          {items.length} item{items.length > 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        refreshing={isLoading && items.length > 0}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemCard: {
    width: ITEM_SIZE,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemImage: {
    width: "100%",
    height: ITEM_SIZE,
    backgroundColor: theme.colors.backgroundTertiary,
  },
  itemInfo: {
    padding: theme.spacing.sm,
  },
  itemLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemPositionCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    textAlign: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
});
