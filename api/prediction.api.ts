import axios from "axios";
import { handleApiError } from "./responseHelper";
import Constants from "expo-constants";

interface PredictionResponse {
  detections: Array<{
    label: string;
    confidence: number;
    bbox: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
    track_id: number | null;
    metadata: {
      class_id: number;
      area: number;
    };
  }>;
  image_size: {
    width: number;
    height: number;
  };
  processing_time: number;
  model_name: string;
  count: number;
}

class PredictionAPI {
  private baseURL =
    Constants.expoConfig?.extra?.predictionApiUrl || "http://localhost:8000";
  private apiKey = "OZhvvjHz9BSqJN89fFHEQ7_qDF0524J19q0kNSCKuqU";

  async predict(imageUri: string, isUrl: boolean = false): Promise<PredictionResponse> {
    try {
      let result;
      
      if (isUrl) {
        // If it's a URL, send it as query parameter
        result = await axios.post(`${this.baseURL}/predict?imageUrl=${encodeURIComponent(imageUri)}`, null, {
          headers: {
            "X-API-Key": this.apiKey,
          },
        });
      } else {
        // If it's a local file, send as FormData
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: "image.jpg",
        } as any);
        
        result = await axios.post(`${this.baseURL}/predict`, formData, {
          headers: {
            "X-API-Key": this.apiKey,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log(
        "Prediction API Response:",
        JSON.stringify(result.data, null, 2)
      );
      return result.data;
    } catch (error) {
      console.error("Prediction API Error:", error);
      throw handleApiError(error);
    }
  }
}

export const predictionAPI = new PredictionAPI();
