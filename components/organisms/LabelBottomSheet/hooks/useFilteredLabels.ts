import { useMemo } from "react";
import { mockObjectLabels, ObjectLabel } from "@/mock/objects";
import { Label } from "@/types/label";
import { Category } from "@/types/category";
import { CategoryWithLabels } from "../types";

interface UseFilteredLabelsProps {
  searchQuery: string;
  selectedCategory: string | null;
  userLabels: ObjectLabel[];
  userCategories: Category[];
  categoryLabels: CategoryWithLabels;
  recentLabels: string[];
  searchResults: Label[];
  isSearching: boolean;
  suggestedLabelIds: string[];
}

export const useFilteredLabels = ({
  searchQuery,
  selectedCategory,
  userLabels,
  userCategories,
  categoryLabels,
  recentLabels,
  searchResults,
  isSearching,
  suggestedLabelIds,
}: UseFilteredLabelsProps) => {
  return useMemo(() => {
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
        const found = userLabels.find((l) => ((l as any)._id || l.id) === labelId);
        if (found) {
          suggestedLabelObjects.push({
            id: found.id || (found as any)._id || `suggested-${found.name}`,
            name: found.name,
            category: "Suggestions",
            icon: "sparkles" as any,
            isDynamic: true,
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
};