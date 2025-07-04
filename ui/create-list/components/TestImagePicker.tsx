import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const TestImagePicker: React.FC = () => {
  const testCamera = async () => {
    console.log('Test camera button pressed');
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync();
        console.log('Camera result:', result);
      } else {
        Alert.alert('Permission refusée', 'Camera permission denied');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Erreur', String(error));
    }
  };

  const testGallery = async () => {
    console.log('Test gallery button pressed');
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Gallery permission status:', status);
      
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync();
        console.log('Gallery result:', result);
      } else {
        Alert.alert('Permission refusée', 'Gallery permission denied');
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Erreur', String(error));
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Test Camera" onPress={testCamera} />
      <View style={{ height: 10 }} />
      <Button title="Test Gallery" onPress={testGallery} />
    </View>
  );
};