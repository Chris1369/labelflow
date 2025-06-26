import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from './StorageKeys';

const RECENT_LABELS_KEY = `${StorageKeys.RECENT_LABELS}`;
const MAX_RECENT_LABELS = 30;

export interface RecentLabel {
  name: string;
  lastUsed: number;
}

export const RecentLabelsManager = {
  // Get recent labels sorted by last used
  async getRecentLabels(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(RECENT_LABELS_KEY);
      if (!stored) return [];
      
      const recentLabels: RecentLabel[] = JSON.parse(stored);
      // Sort by most recent first
      return recentLabels
        .sort((a, b) => b.lastUsed - a.lastUsed)
        .map(label => label.name);
    } catch (error) {
      console.error('Error getting recent labels:', error);
      return [];
    }
  },

  // Add or update a label in recent list
  async addRecentLabel(labelName: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(RECENT_LABELS_KEY);
      let recentLabels: RecentLabel[] = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists
      recentLabels = recentLabels.filter(label => label.name !== labelName);
      
      // Add at the beginning
      recentLabels.unshift({
        name: labelName,
        lastUsed: Date.now()
      });
      
      // Keep only MAX_RECENT_LABELS
      if (recentLabels.length > MAX_RECENT_LABELS) {
        recentLabels = recentLabels.slice(0, MAX_RECENT_LABELS);
      }
      
      await AsyncStorage.setItem(RECENT_LABELS_KEY, JSON.stringify(recentLabels));
    } catch (error) {
      console.error('Error adding recent label:', error);
    }
  },

  // Clear all recent labels
  async clearRecentLabels(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RECENT_LABELS_KEY);
    } catch (error) {
      console.error('Error clearing recent labels:', error);
    }
  }
};