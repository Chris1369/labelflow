import { Label } from "@/types/label";
import { Category } from "@/types/category";
import { LabelCounter } from "@/types/project";
import { ObjectLabel } from "@/mock/objects";

export interface LabelBottomSheetProps {
  onSelectLabel: (label: string) => void;
  hasExistingLabel?: boolean;
  labelCounters?: LabelCounter[];
  suggestedLabelIds?: string[];
}

export interface LabelBottomSheetRef {
  open: () => void;
  close: () => void;
}

export interface CategoryWithLabels {
  [categoryId: string]: Label[];
}

export interface CategoryItem {
  id: string;
  name: string;
  isDynamic: boolean;
}

export interface LabelItemProps {
  item: ObjectLabel & { isDynamic?: boolean; isRecent?: boolean };
  labelCounters: LabelCounter[];
  onSelect: (label: ObjectLabel) => void;
}

export interface CategoryChipProps {
  item: CategoryItem;
  isSelected: boolean;
  onPress: (categoryId: string | null) => void;
}

export interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredLabels: ObjectLabel[];
  isCreating: boolean;
  onAddCustomLabel: () => void;
}

export interface CategoryListProps {
  categories: CategoryItem[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  visible: boolean;
}

export interface LabelListProps {
  labels: (ObjectLabel & { isDynamic?: boolean; isRecent?: boolean })[];
  labelCounters: LabelCounter[];
  onSelectLabel: (label: ObjectLabel) => void;
  isSearching: boolean;
}