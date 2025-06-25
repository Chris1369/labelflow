import { create } from 'zustand';
import { ExportState, ExportActions, ExportFormat } from './types';
import { exportAPI } from '@/api/export.api';
import { ExportType } from '@/types/export';

export const useExportStore = create<ExportState & ExportActions>((set, get) => ({
  selectedFormat: null,
  isExporting: false,
  exportError: null,

  setSelectedFormat: (format) => set({ selectedFormat: format }),

  exportProject: async (projectId: string, format: ExportFormat) => {
    set({ isExporting: true, exportError: null, selectedFormat: format });
    
    try {
      // Get current user from API
      const { authAPI } = await import('@/api/auth.api');
      const user = await authAPI.getCurrentUser();
      
      if (!user || !user._id) {
        throw new Error('User not found');
      }
      
      // Create export request
      const response = await exportAPI.createExport({
        ownerId: user._id,
        fromProjectId: projectId,
        type: format as ExportType
      });
      
      set({ isExporting: false });
      
      // Return the export data for the actions to handle
      return response.data;
    } catch (error) {
      set({ 
        isExporting: false, 
        exportError: 'Erreur lors de l\'export' 
      });
      throw error;
    }
  },

  resetState: () => set({
    selectedFormat: null,
    isExporting: false,
    exportError: null
  })
}));