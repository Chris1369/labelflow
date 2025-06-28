import axios from 'axios';
import Constants from 'expo-constants';
import { AnnotationRequest } from '@/types/training';
import { handleApiError } from './responseHelper';

class TrainingAnnotationAPI {
  private baseURL = Constants.expoConfig?.extra?.predictionApiUrl || 'http://localhost:8000';
  private apiKey = 'OZhvvjHz9BSqJN89fFHEQ7_qDF0524J19q0kNSCKuqU';

  /**
   * Send training annotations for an image
   * @param imageUri - URI of the image
   * @param imageWidth - Width of the image in pixels
   * @param imageHeight - Height of the image in pixels
   * @param annotations - Array of annotations with normalized coordinates
   */
  async sendAnnotations(
    imageUri: string,
    imageWidth: number,
    imageHeight: number,
    annotations: AnnotationRequest
  ): Promise<void> {
    try {
      const formData = new FormData();
      
      // Add image file
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);
      
      // Add image dimensions
      formData.append('image_width', imageWidth.toString());
      formData.append('image_height', imageHeight.toString());
      
      // Add annotations as JSON string
      formData.append('annotations', JSON.stringify(annotations));

      console.log('Sending training annotations:', {
        imageWidth,
        imageHeight,
        annotationsCount: annotations.annotations.length,
        annotations: annotations.annotations,
      });

      const response = await axios.post(
        `${this.baseURL}/training/annotation`,
        formData,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Training annotations sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending training annotations:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Helper method to convert bounding box format from app to API format
   * App format: centerX, centerY, width, height (all 0-1)
   * API format: x, y, width, height (all 0-1, where x,y is center)
   */
  convertBoundingBoxFormat(
    boundingBoxes: Array<{
      centerX: number;
      centerY: number;
      width: number;
      height: number;
      label: string;
    }>
  ): AnnotationRequest {
    return {
      annotations: boundingBoxes.map(box => ({
        x: box.centerX,
        y: box.centerY,
        width: box.width,
        height: box.height,
        label: box.label,
      })),
    };
  }
}

export const trainingAnnotationAPI = new TrainingAnnotationAPI();