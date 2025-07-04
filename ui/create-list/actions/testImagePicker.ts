import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const testImagePicker = {
  testCamera: async () => {
    try {
      console.log('=== TEST CAMERA START ===');
      
      // Check permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission result:', permissionResult);
      
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission refusée', 'Camera permission is required');
        return;
      }
      
      // Launch camera
      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });
      
      console.log('Camera result:', result);
      
      if (!result.canceled) {
        Alert.alert('Success', `Image captured: ${result.assets[0].uri}`);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', String(error));
    }
  },
  
  testGallery: async () => {
    try {
      console.log('=== TEST GALLERY START ===');
      
      // Check permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Gallery permission result:', permissionResult);
      
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission refusée', 'Gallery permission is required');
        return;
      }
      
      // Launch gallery
      console.log('Launching gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });
      
      console.log('Gallery result:', result);
      
      if (!result.canceled) {
        Alert.alert('Success', `Image selected: ${result.assets[0].uri}`);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', String(error));
    }
  }
};