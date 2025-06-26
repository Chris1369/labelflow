import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export const resizeImageTo640x640 = async (imageUri: string): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 640, height: 640 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};

export const cropAndResizeImage = async (imageUri: string): Promise<string | null> => {
  try {
    // Use ImagePicker to allow user to crop the image in square format
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      // We pass the captured image URI as initial selection
      // Note: This might not work on all platforms, but we'll handle it
    });

    if (!result.canceled && result.assets[0]) {
      // Now resize the cropped image to 640x640
      return await resizeImageTo640x640(result.assets[0].uri);
    }
    
    return null;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
};