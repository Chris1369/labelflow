import React, {
  useCallback,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { debounce } from "lodash";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Keyboard,
  TextStyle,
} from "react-native";
import { Input } from "../atoms";
import { theme } from "../../types/theme";
import {
  mockObjectLabels,
  getObjectCategories,
  ObjectLabel,
} from "../../mock/objects";
import { Ionicons } from "@expo/vector-icons";
import { labelAPI } from "@/api/label.api";
import { categoryAPI } from "@/api/category.api";
import { Category } from "@/types/category";
import { Label } from "@/types/label";
import { LabelCounter } from "@/types/project";
import { RecentLabelsManager } from "@/helpers/recentLabels";
import { trainingClassAPI } from "@/api/trainingClass.api";

const { height: screenHeight } = Dimensions.get("window");

interface LabelBottomSheetProps {
  onSelectLabel: (label: string) => void;
  hasExistingLabel?: boolean;
  labelCounters?: LabelCounter[];
  suggestedLabelIds?: string[];
}

export interface LabelBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const LabelBottomSheet = forwardRef<
  LabelBottomSheetRef,
  LabelBottomSheetProps
>(
  (
    {
      onSelectLabel,
      hasExistingLabel = false,
      labelCounters = [],
      suggestedLabelIds = [],
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
    );
    const [isPublic, setIsPublic] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [userLabels, setUserLabels] = useState<ObjectLabel[]>([]);
    const [userCategories, setUserCategories] = useState<Category[]>([]);
    const [categoryLabels, setCategoryLabels] = useState<{
      [categoryId: string]: Label[];
    }>({});
    const [recentLabels, setRecentLabels] = useState<string[]>([]);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [searchResults, setSearchResults] = useState<Label[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const categories = useMemo(() => {
      const dynamicCategories = userCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        isDynamic: true,
      }));
      const staticCategories = [
        "Tous",
        "Mes labels",
        ...getObjectCategories(),
      ].map((name) => ({
        id: name,
        name: name,
        isDynamic: false,
      }));
      return [...dynamicCategories, ...staticCategories];
    }, [userCategories]);

    const filteredLabels = useMemo(() => {
      // Create a map to track if a label is dynamic (user-created)
      const userLabelNames = new Set(
        userLabels.map((l) => l.name.toLowerCase())
      );

      // If searching with API results or still searching
      if (searchQuery && searchQuery.trim().length >= 2) {
        // If we have API results, use them
        if (searchResults.length > 0) {
          // Convert API results to ObjectLabel format
          const formattedResults = searchResults.map((label) => ({
            id: label.id || label._id || `api-${label.name}`,
            name: label.name,
            category: "Résultats de recherche",
            icon: "search" as any,
            isDynamic: true, // API results are user labels
          }));

          // Also check recent labels
          const query = searchQuery.toLowerCase().trim();
          const recentMatches = recentLabels
            .filter((labelName) => labelName.toLowerCase().includes(query))
            .map((labelName) => {
              const existingResult = formattedResults.find(
                (l) => l.name.toLowerCase() === labelName.toLowerCase()
              );
              if (existingResult) return null;
              return {
                id: `recent-${labelName}`,
                name: labelName,
                category: "Récents",
                icon: "time" as any,
                isDynamic: userLabelNames.has(labelName.toLowerCase()),
                isRecent: true,
              };
            })
            .filter(Boolean) as ObjectLabel[];

          return [...recentMatches, ...formattedResults];
        }

        // If still searching, show loading or empty state
        if (isSearching) {
          return [];
        }

        // If search returned no results, also search in local data
        const query = searchQuery.toLowerCase().trim();
        const localLabels = [...mockObjectLabels, ...userLabels];
        const localMatches = localLabels
          .filter((label) => label.name.toLowerCase().includes(query))
          .map((label) => ({
            ...label,
            isDynamic: userLabelNames.has(label.name.toLowerCase()),
          }));

        return localMatches;
      }

      // If a dynamic category is selected, show its labels
      if (
        selectedCategory &&
        userCategories.some((cat) => cat.id === selectedCategory)
      ) {
        const catLabels = categoryLabels[selectedCategory] || [];
        const formatted = catLabels.map((label) => ({
          id: label.id,
          name: label.name,
          category:
            userCategories.find((cat) => cat.id === selectedCategory)?.name ||
            "",
          icon: "pricetag" as any,
          isDynamic: true,
        }));

        return formatted;
      }

      // Otherwise, use the original logic
      let allLabels = [...mockObjectLabels, ...userLabels];

      // Mark dynamic labels
      allLabels = allLabels.map((label) => ({
        ...label,
        isDynamic: userLabelNames.has(label.name.toLowerCase()),
      }));

      // Filter by category first if selected
      if (selectedCategory && selectedCategory !== "Tous") {
        allLabels = allLabels.filter(
          (label) => label.category === selectedCategory
        );
      }

      // If we have suggested labels and no search/category filter, show them first
      if (!selectedCategory && !searchQuery && suggestedLabelIds.length > 0) {
        const suggestedLabelObjects: ObjectLabel[] = [];
        const suggestedNames = new Set<string>();

        // First, add suggested labels
        for (const labelId of suggestedLabelIds) {
          const found = userLabels.find((l) => (l._id || l.id) === labelId);
          if (found) {
            suggestedLabelObjects.push({
              id: found.id || found._id || `suggested-${found.name}`,
              name: found.name,
              category: "Suggestions",
              icon: "sparkles" as any,
              isDynamic: true,
              // isSuggested: true,
            });
            suggestedNames.add(found.name);
          }
        }

        // Then add recent labels that aren't already suggested
        const recentLabelObjects: ObjectLabel[] = recentLabels
          .filter((labelName) => !suggestedNames.has(labelName))
          .map((labelName) => {
            const found = allLabels.find((l) => l.name === labelName);
            if (found) return { ...found, isRecent: true };
            return {
              id: `recent-${labelName}`,
              name: labelName,
              category: "Récents",
              icon: "time" as any,
              isDynamic: userLabelNames.has(labelName.toLowerCase()),
              isRecent: true,
            };
          })
          .filter(Boolean);

        // Remove duplicates from the main list
        const priorityNames = new Set([...suggestedNames, ...recentLabels]);
        const otherLabels = allLabels.filter(
          (label) => !priorityNames.has(label.name)
        );

        return [
          ...suggestedLabelObjects,
          ...recentLabelObjects,
          ...otherLabels,
        ];
      }

      // If no search query and showing all labels, show recent labels first
      if (!selectedCategory && !searchQuery && recentLabels.length > 0) {
        const recentLabelObjects: ObjectLabel[] = recentLabels
          .map((labelName) => {
            const found = allLabels.find((l) => l.name === labelName);
            if (found) return { ...found, isRecent: true };
            return {
              id: `recent-${labelName}`,
              name: labelName,
              category: "Récents",
              icon: "time" as any,
              isDynamic: userLabelNames.has(labelName.toLowerCase()),
              isRecent: true,
            };
          })
          .filter(Boolean);

        // Remove duplicates from the main list
        const recentNames = new Set(recentLabels);
        const otherLabels = allLabels.filter(
          (label) => !recentNames.has(label.name)
        );

        return [...recentLabelObjects, ...otherLabels];
      }

      return allLabels;
    }, [
      searchQuery,
      selectedCategory,
      userLabels,
      userCategories,
      categoryLabels,
      recentLabels,
      searchResults,
      isSearching,
      suggestedLabelIds,
    ]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsVisible(true);
        loadUserData();
      },
      close: () => {
        setIsVisible(false);
        Keyboard.dismiss();
      },
    }));

    useEffect(() => {
      const keyboardWillShow = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );

      const keyboardWillHide = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => {
          setKeyboardHeight(0);
        }
      );

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    }, []);

    const loadUserData = async () => {
      try {
        // Load recent labels
        const recent = await RecentLabelsManager.getRecentLabels();
        setRecentLabels(recent);

        // Load user labels
        const labels = await labelAPI.getMyLabels();
        const formattedLabels: ObjectLabel[] = labels.map((label) => ({
          id: label.id,
          name: label.name,
          category: "Mes labels",
          icon: "pricetag" as any,
        }));
        setUserLabels(formattedLabels);

        // Load user categories
        const categories = await categoryAPI.getMyCategories();
        setUserCategories(categories);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    // Debounced search function
    const searchLabels = useCallback(
      debounce(async (query: string) => {
        if (!query || query.trim().length < 2) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        setIsSearching(true);
        try {
          const results = await labelAPI.searchLabels(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300),
      []
    );

    // Trigger search when query changes
    useEffect(() => {
      if (searchQuery.trim().length >= 2) {
        searchLabels(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, [searchQuery, searchLabels]);

    // Load category labels when a category is selected
    useEffect(() => {
      if (
        selectedCategory &&
        userCategories.some((cat) => cat.id === selectedCategory)
      ) {
        loadCategoryLabels(selectedCategory);
      }
    }, [selectedCategory, userCategories]);

    const loadCategoryLabels = async (categoryId: string) => {
      try {
        const category = userCategories.find((cat) => cat.id === categoryId);
        if (category && category.labels) {
          // If labels are populated objects
          if (typeof category.labels[0] === "object") {
            setCategoryLabels((prev) => ({
              ...prev,
              [categoryId]: category.labels as Label[],
            }));
          } else {
            // If labels are IDs, we might need to fetch them
            // For now, we'll assume they're populated
            console.log("Labels are IDs, not objects");
          }
        }
      } catch (error) {
        console.error("Failed to load category labels:", error);
      }
    };

    const handleSelectLabel = async (label: ObjectLabel) => {
      // Add to recent labels
      await RecentLabelsManager.addRecentLabel(label.name);

      // Ensure training class exists for this label
      try {
        await trainingClassAPI.getOrCreate(
          label.name,
          `Label: ${label.name} - Catégorie: ${label.category || "Non classé"}`
        );
        console.log(`Training class verified for label: ${label.name}`);
      } catch (classError) {
        // Log but don't fail if training class check fails
        console.error("Failed to verify training class:", classError);
      }

      onSelectLabel(label.name);
      setIsVisible(false);
      setSearchQuery("");
      setIsPublic(false);
    };

    const handleAddCustomLabel = async () => {
      if (searchQuery.trim()) {
        setIsCreating(true);
        try {
          const labelName = searchQuery.trim();

          // Create label in our database
          await labelAPI.create({
            name: labelName,
            isPublic,
          });

          // Create corresponding training class for AI model
          try {
            await trainingClassAPI.create({
              name: labelName,
              description: `Label personnalisé créé depuis l'app Labelflow`,
            });
            console.log(`Training class created for label: ${labelName}`);
          } catch (classError) {
            // Log but don't fail if training class creation fails
            console.error("Failed to create training class:", classError);
          }

          // Add to recent labels
          await RecentLabelsManager.addRecentLabel(labelName);

          // Add to selection and close
          onSelectLabel(labelName);
          setIsVisible(false);
          setSearchQuery("");
          setIsPublic(false);

          Alert.alert("Succès", `Label "${labelName}" créé avec succès`);
        } catch (error: any) {
          Alert.alert(
            "Erreur",
            error.message || "Impossible de créer le label"
          );
        } finally {
          setIsCreating(false);
        }
      }
    };

    const renderLabel = ({
      item,
    }: {
      item: ObjectLabel & { isDynamic?: boolean; isRecent?: boolean };
    }) => {
      // Find the counter for this label
      const labelCounter = labelCounters.find(
        (counter) => counter.label.toLowerCase() === item.name.toLowerCase()
      );

      return (
        <TouchableOpacity
          style={[styles.labelItem, item.isRecent && styles.recentLabelItem]}
          onPress={() => handleSelectLabel(item)}
        >
          <View style={styles.labelContent}>
            {item.isDynamic && <View style={styles.dynamicLabelIndicator} />}
            <Text style={styles.labelText}>{item.name}</Text>
          </View>

          <View style={styles.labelRightContent}>
            {labelCounter && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{labelCounter.count}</Text>
              </View>
            )}
            <Text
              style={[
                styles.labelCategory,
                item.isRecent && styles.recentLabelCategory,
              ]}
            >
              {item.category}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderCategory = ({
      item,
    }: {
      item: { id: string; name: string; isDynamic: boolean };
    }) => (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          selectedCategory === item.id && styles.categoryChipActive,
        ]}
        onPress={() =>
          setSelectedCategory(item.name === "Tous" ? null : item.id)
        }
      >
        <View style={styles.categoryContent}>
          <Text
            style={[
              styles.categoryText,
              selectedCategory === item.id && styles.categoryTextActive,
            ]}
          >
            {item.name}
          </Text>
          {item.isDynamic && <View style={styles.dynamicIndicator} />}
        </View>
      </TouchableOpacity>
    );

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={() => setIsVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <View
              style={[
                styles.container,
                {
                  maxHeight: screenHeight * 0.9 - keyboardHeight,
                  minHeight: Math.min(
                    screenHeight * 0.5,
                    screenHeight * 0.9 - keyboardHeight
                  ),
                },
              ]}
            >
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.title}>Sélectionner un label</Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Ionicons name='close' size={24} color={theme.colors.text} />
              </TouchableOpacity>

              <View style={styles.searchContainer}>
                <Input
                  placeholder='Rechercher ou ajouter un label...'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  icon='search-outline'
                />
                {searchQuery.trim() &&
                  !filteredLabels.some(
                    (l) => l.name.toLowerCase() === searchQuery.toLowerCase()
                  ) && (
                    <View style={styles.addLabelContainer}>
                      {/* <View style={styles.switchContainer}>
                      <Text style={styles.switchLabel}>Rendre public</Text>
                      <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{
                          false: theme.colors.border,
                          true: theme.colors.primary + "80",
                        }}
                        thumbColor={
                          isPublic
                            ? theme.colors.primary
                            : theme.colors.backgroundSecondary
                        }
                      />
                    </View> */}
                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          isCreating && styles.addButtonDisabled,
                        ]}
                        onPress={handleAddCustomLabel}
                        disabled={isCreating}
                      >
                        <Ionicons
                          name='add-circle'
                          size={24}
                          color={
                            isCreating
                              ? theme.colors.textSecondary
                              : theme.colors.primary
                          }
                        />
                        <Text
                          style={[
                            styles.addButtonText,
                            isCreating && styles.addButtonTextDisabled,
                          ]}
                        >
                          {isCreating
                            ? "Création..."
                            : `Ajouter "${searchQuery}"`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </View>

              {!searchQuery && (
                <FlatList
                  horizontal
                  data={categories}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCategory}
                  style={styles.categoriesList}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ alignItems: "center" }}
                />
              )}

              <FlatList
                data={filteredLabels}
                keyExtractor={(item) => item.id}
                renderItem={renderLabel}
                style={styles.labelsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    {isSearching
                      ? "Recherche en cours..."
                      : "Aucun label trouvé"}
                  </Text>
                }
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    minHeight: screenHeight * 0.5,
    maxHeight: screenHeight * 0.9,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  title: {
    ...theme.fonts.subtitle,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.lg,
    top: theme.spacing.lg,
    padding: theme.spacing.xs,
    zIndex: 1,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  addLabelContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  switchLabel: {
    ...theme.fonts.body,
  } as TextStyle,
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  addButtonText: {
    ...theme.fonts.button,
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
  },
  addButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 45,
    maxHeight: 45,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 35,
    justifyContent: "center",
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  categoryText: {
    ...theme.fonts.caption,
    color: theme.colors.text,
  },
  categoryTextActive: {
    color: theme.colors.secondary,
  },
  dynamicIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginLeft: 4,
  },
  labelsList: {
    paddingHorizontal: theme.spacing.lg,
    flex: 1,
  },
  labelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recentLabelItem: {
    backgroundColor: theme.colors.primary + "05",
  },
  labelContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  labelText: {
    ...theme.fonts.body,
    marginLeft: theme.spacing.xs,
  },
  labelRightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  counterBadge: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
    minWidth: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  counterText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  labelCategory: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  recentLabelCategory: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  dynamicLabelIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  emptyText: {
    ...theme.fonts.body,
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
});
