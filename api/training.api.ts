import axios from 'axios';
import Constants from 'expo-constants';
import { TrainingConfig, TrainingResponse } from '@/types/training';
import { handleApiError } from './responseHelper';

class TrainingAPI {
  private baseURL = Constants.expoConfig?.extra?.predictionApiUrl || 'http://localhost:8000';
  private apiKey = 'OZhvvjHz9BSqJN89fFHEQ7_qDF0524J19q0kNSCKuqU';

  /**
   * Start model training
   * @param config - Training configuration (epochs, batch_size)
   */
  async startTraining(config: TrainingConfig = {}): Promise<TrainingResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add parameters if provided
      if (config.epochs) {
        params.append('epochs', config.epochs.toString());
      }
      if (config.batch_size) {
        params.append('batch_size', config.batch_size.toString());
      }
      if (config.use_hybrid !== undefined) {
        params.append('use_hybrid', config.use_hybrid.toString());
      }

      console.log('Starting training with config:', config);

      const response = await axios.post(
        `${this.baseURL}/training/start?${params.toString()}`,
        null,
        {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }
      );
      
      console.log('Training started:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error starting training:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Get training status
   * @param taskId - Optional task ID to check specific training session
   */
  async getTrainingStatus(taskId?: string): Promise<TrainingResponse> {
    try {
      const url = taskId 
        ? `${this.baseURL}/training/status/${taskId}`
        : `${this.baseURL}/training/status`;

      const response = await axios.get(url, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });
      
      console.log('Training status:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting training status:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Stop training
   */
  async stopTraining(): Promise<TrainingResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/training/stop`,
        null,
        {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }
      );
      
      console.log('Training stopped:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error stopping training:', error);
      throw handleApiError(error);
    }
  }
}

export const trainingAPI = new TrainingAPI();