import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useExportStore } from './useStore';
import { ExportFormat } from './types';

export const exportActions = {
  handleExport: async (projectId: string, format: ExportFormat) => {
    const { exportProject } = useExportStore.getState();
    
    try {
      await exportProject(projectId, format);
      
      Alert.alert(
        'Export réussi',
        `Le projet a été exporté au format ${format.toUpperCase()}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'export',
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