import { useCreateProjectStore } from './useStore';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const createProjectActions = {
  createProject: async () => {
    const { name, description } = useCreateProjectStore.getState();
    
    // Validation
    if (!name.trim()) {
      useCreateProjectStore.getState().setError('Le nom du projet est obligatoire');
      return;
    }
    
    if (!description.trim()) {
      useCreateProjectStore.getState().setError('La description du projet est obligatoire');
      return;
    }
    
    try {
      useCreateProjectStore.getState().setIsCreating(true);
      useCreateProjectStore.getState().setError(null);
      
      // TODO: API call to create project
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock creating a project
      const newProject = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString(),
      };
      
      console.log('Project created:', newProject);
      
      // Reset form and navigate
      useCreateProjectStore.getState().resetForm();
      
      Alert.alert(
        'Succès',
        'Le projet a été créé avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/select-project'),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating project:', error);
      useCreateProjectStore.getState().setError('Une erreur est survenue lors de la création du projet');
    } finally {
      useCreateProjectStore.getState().setIsCreating(false);
    }
  },
  
  cancelCreation: () => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler la création du projet ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => {
            useCreateProjectStore.getState().resetForm();
            router.back();
          },
        },
      ]
    );
  },
};