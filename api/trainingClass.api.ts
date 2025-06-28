import axios from 'axios';
import Constants from 'expo-constants';
import { TrainingClass, CreateClassRequest } from '@/types/training';
import { handleApiError } from './responseHelper';

class TrainingClassAPI {
  private baseURL = Constants.expoConfig?.extra?.predictionApiUrl || 'http://localhost:8000';
  private apiKey = 'OZhvvjHz9BSqJN89fFHEQ7_qDF0524J19q0kNSCKuqU';

  /**
   * Get all training classes
   */
  async getAll(): Promise<TrainingClass[]> {
    try {
      const response = await axios.get(`${this.baseURL}/classes`, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });
      
      console.log('Training classes fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching training classes:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Add a new training class
   */
  async create(data: CreateClassRequest): Promise<TrainingClass> {
    try {
      const response = await axios.post(
        `${this.baseURL}/classes/add`,
        null,
        {
          params: {
            name: data.name,
            description: data.description,
          },
          headers: {
            'X-API-Key': this.apiKey,
          },
        }
      );
      
      console.log('Training class created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating training class:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Delete a training class
   */
  async delete(classId: number): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/classes/${classId}`, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });
      
      console.log(`Training class ${classId} deleted`);
    } catch (error) {
      console.error(`Error deleting training class ${classId}:`, error);
      throw handleApiError(error);
    }
  }

  /**
   * Find a class by name
   */
  async findByName(name: string): Promise<TrainingClass | undefined> {
    try {
      const classes = await this.getAll();
      return classes.find(c => c.name === name);
    } catch (error) {
      console.error('Error finding class by name:', error);
      throw error;
    }
  }

  /**
   * Get or create a class
   */
  async getOrCreate(name: string, description?: string): Promise<TrainingClass> {
    try {
      // First try to find the class
      const existingClass = await this.findByName(name);
      if (existingClass) {
        return existingClass;
      }

      // If not found, create it
      return await this.create({ name, description });
    } catch (error) {
      console.error('Error in getOrCreate:', error);
      throw error;
    }
  }
}

export const trainingClassAPI = new TrainingClassAPI();