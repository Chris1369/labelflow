import { Category } from '@/types/category';
import { Label } from '@/types/label';

export interface AddLabelsModalProps {
  isVisible: boolean;
  onClose: () => void;
  category: Category;
  onLabelsUpdated: () => void;
}

export interface LabelItemProps {
  item: Label;
  isSelected: boolean;
  isExisting: boolean;
  onToggle: (labelId: string) => void;
}

export interface LabelListProps {
  labels: Label[];
  selectedLabelIds: Set<string>;
  categoryLabels: (string | Label)[];
  onToggleLabelSelection: (labelId: string) => void;
  searchQuery: string;
}

export interface HeaderSectionProps {
  categoryName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  error?: string | null;
}

export interface ActionButtonsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
}

export interface LegendSectionProps {}