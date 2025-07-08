import { useState, useCallback } from "react";
import { labelAPI } from "@/api/label.api";
import { categoryAPI } from "@/api/category.api";
import { Category } from "@/types/category";
import { Label } from "@/types/label";
import { ObjectLabel } from "@/mock/objects";
import { RecentLabelsManager } from "@/helpers/recentLabels";
import { CategoryWithLabels } from "../types";

export const useUserData = () => {
  const [userLabels, setUserLabels] = useState<ObjectLabel[]>([]);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [categoryLabels, setCategoryLabels] = useState<CategoryWithLabels>({});
  const [recentLabels, setRecentLabels] = useState<string[]>([]);

  const loadUserData = useCallback(async () => {
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
  }, []);

  const loadCategoryLabels = useCallback(
    async (categoryId: string) => {
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
            console.log("Labels are IDs, not objects");
          }
        }
      } catch (error) {
        console.error("Failed to load category labels:", error);
      }
    },
    [userCategories]
  );

  return {
    userLabels,
    userCategories,
    categoryLabels,
    recentLabels,
    loadUserData,
    loadCategoryLabels,
  };
};