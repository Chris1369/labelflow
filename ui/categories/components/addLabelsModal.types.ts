import { Category } from '@/types/category';

export interface AddLabelsModalProps {
  isVisible: boolean;
  onClose: () => void;
  category: Category;
  onLabelsUpdated: () => void;
}