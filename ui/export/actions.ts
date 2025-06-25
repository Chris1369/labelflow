import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useExportStore } from './useStore';
import { ExportFormat } from './types';

export const exportActions = {
  handleExport: async (projectId: string, format: ExportFormat) => {
    const { exportProject } = useExportStore.getState();
    
    try {
      const exportData = await exportProject(projectId, format);
      
      Alert.alert(
        'Export lancé',
        `L'export au format ${format.toUpperCase()} a été lancé avec succès. Vous recevrez une notification lorsqu'il sera prêt.`,
        [{ 
          text: 'OK',
          onPress: () => {
            // Navigate back to project screen
            router.back();
          }
        }]
      );
    } catch (error: any) {
      console.error('Export error:', error);
      
      Alert.alert(
        'Erreur',
        error.message || 'Une erreur est survenue lors de l\'export',
        [{ text: 'OK' }]
      );
    }
  },

  handleBack: () => {
    const { resetState } = useExportStore.getState();
    resetState();
    router.back();
  }
};