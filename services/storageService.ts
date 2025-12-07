
import { SavedSummary, TradingPlan, UserProfile, StockFundamentalAnalysis } from '../types';

const STORAGE_KEYS = {
  SUMMARIES: 'optionsAI_summaries',
  PLANS: 'optionsAI_plans',
  USER: 'optionsAI_user',
  WATCHLIST: 'optionsAI_watchlist'
};

export const storageService = {
  // --- SUMMARIES ---
  
  getSummaries: (): SavedSummary[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading summaries:", error);
      return [];
    }
  },

  saveSummary: (summary: SavedSummary): SavedSummary[] => {
    try {
      const current = storageService.getSummaries();
      // FIX: Check for unique ID, not Module ID. This allows multiple summaries per module.
      const existingIndex = current.findIndex(s => s.id === summary.id);
      
      let updated;
      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = summary;
      } else {
        updated = [summary, ...current];
      }
      
      localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error saving summary:", error);
      return [];
    }
  },

  // --- TRADING PLANS ---

  getPlans: (): TradingPlan[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading plans:", error);
      return [];
    }
  },

  savePlan: (plan: TradingPlan): TradingPlan[] => {
    try {
      const current = storageService.getPlans();
      const existingIndex = current.findIndex(p => p.id === plan.id);
      
      let updated;
      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = plan;
      } else {
        updated = [plan, ...current];
      }
      
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error saving plan:", error);
      return [];
    }
  },

  // --- WATCHLIST (ROUTINE) ---
  
  getWatchlist: (): StockFundamentalAnalysis[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading watchlist:", error);
      return [];
    }
  },

  saveWatchlist: (watchlist: StockFundamentalAnalysis[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    } catch (error) {
      console.error("Error saving watchlist:", error);
    }
  },

  // --- USER PROFILE ---

  getUserProfile: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading user profile:", error);
      return null;
    }
  },

  saveUserProfile: (user: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  },

  // --- BACKUP & RESTORE ---

  getAllData: () => {
    return {
      user: storageService.getUserProfile(),
      summaries: storageService.getSummaries(),
      plans: storageService.getPlans(),
      watchlist: storageService.getWatchlist(),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
  },

  restoreData: (jsonData: any): boolean => {
    try {
      if (jsonData.user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(jsonData.user));
      if (jsonData.summaries) localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(jsonData.summaries));
      if (jsonData.plans) localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(jsonData.plans));
      if (jsonData.watchlist) localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(jsonData.watchlist));
      return true;
    } catch (e) {
      console.error("Failed to restore data", e);
      return false;
    }
  }
};
