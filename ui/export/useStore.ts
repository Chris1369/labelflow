import { create } from 'zustand';
import { ExportState, ExportActions, ExportFormat } from './types';

export const useExportStore = create<ExportState & ExportActions>((set, get) => ({
  selectedFormat: null,
  isExporting: false,
  exportError: null,

  setSelectedFormat: (format) => set({ selectedFormat: format }),

  exportProject: async (projectId: string, format: ExportFormat) => {
    set({ isExporting: true, exportError: null });
    
    try {
      console.log(`Exporting project ${projectId} in format: ${format}`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      set({ isExporting: false });
    } catch (error) {
      set({ 
        isExporting: false, 
        exportError: 'Erreur lors de l\'export' 
      });
    }
  },

  resetState: () => set({
    selectedFormat: null,
    isExporting: false,
    exportError: null
  })
}));