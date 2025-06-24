import { create } from 'zustand';

interface ImportState {
  selectedImages: string[];
  selectedFile: string | null;
  isImporting: boolean;
  error: string | null;
  importType: 'images' | 'file' | null;
}

interface ImportActions {
  setSelectedImages: (images: string[]) => void;
  setSelectedFile: (file: string | null) => void;
  setIsImporting: (isImporting: boolean) => void;
  setError: (error: string | null) => void;
  setImportType: (type: 'images' | 'file' | null) => void;
  resetImport: () => void;
}

export const useImportStore = create<ImportState & ImportActions>((set, get) => ({
  selectedImages: [],
  selectedFile: null,
  isImporting: false,
  error: null,
  importType: null,

  setSelectedImages: (images) => set({ selectedImages: images }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setIsImporting: (isImporting) => set({ isImporting }),
  setError: (error) => set({ error }),
  setImportType: (importType) => set({ importType }),
  
  resetImport: () => set({
    selectedImages: [],
    selectedFile: null,
    isImporting: false,
    error: null,
    importType: null,
  }),
}));