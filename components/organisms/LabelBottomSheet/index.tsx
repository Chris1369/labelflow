import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { getObjectCategories, ObjectLabel } from "@/mock/objects";
import { labelAPI } from "@/api/label.api";
import { RecentLabelsManager } from "@/helpers/recentLabels";
import { trainingClassAPI } from "@/api/trainingClass.api";
import {
  LabelBottomSheetProps,
  LabelBottomSheetRef,
  CategoryItem,
} from "./types";
import {
  SearchSection,
  CategoryList,
  LabelList,
} from "./components";
import {
  useLabelSearch,
  useUserData,
  useFilteredLabels,
} from "./hooks";
import { styles } from "./styles";

const { height: screenHeight } = Dimensions.get("window");

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
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Custom hooks
    const { searchResults, isSearching, triggerSearch } = useLabelSearch();
    const {
      userLabels,
      userCategories,
      categoryLabels,
      recentLabels,
      loadUserData,
      loadCategoryLabels,
    } = useUserData();

    // Categories list
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

    // Filtered labels
    const filteredLabels = useFilteredLabels({
      searchQuery,
      selectedCategory,
      userLabels,
      userCategories,
      categoryLabels,
      recentLabels,
      searchResults,
      isSearching,
      suggestedLabelIds,
    });

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

    // Trigger search when query changes
    useEffect(() => {
      triggerSearch(searchQuery);
    }, [searchQuery, triggerSearch]);

    // Load category labels when a category is selected
    useEffect(() => {
      if (
        selectedCategory &&
        userCategories.some((cat) => cat.id === selectedCategory)
      ) {
        loadCategoryLabels(selectedCategory);
      }
    }, [selectedCategory, userCategories, loadCategoryLabels]);

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

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
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
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>

              <SearchSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filteredLabels={filteredLabels}
                isCreating={isCreating}
                onAddCustomLabel={handleAddCustomLabel}
              />

              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                visible={!searchQuery}
              />

              <LabelList
                labels={filteredLabels}
                labelCounters={labelCounters}
                onSelectLabel={handleSelectLabel}
                isSearching={isSearching}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
);