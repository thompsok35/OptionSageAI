
export interface CourseModule {
  id: string;
  title: string;
  category: string;
  level: number; // Added level for filtering
  duration: string;
  thumbnail: string;
  description: string;
  // In a real app, this would be the video URL. 
  // For this demo, we store a transcript to simulate "watching" and summarizing.
  mockTranscript: string; 
}

export interface SavedSummary {
  id: string;
  moduleId: string;
  moduleTitle: string;
  content: string;
  createdAt: number;
  tags: string[];
  instructor?: string; // New field
  notes?: string;      // New field
  videoUrl?: string;   // New field: Link to the specific training video
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PLAYER = 'PLAYER',
  LIBRARY = 'LIBRARY',
  PROFILE = 'PROFILE',
  GRADUATION = 'GRADUATION',
  ROUTINE = 'ROUTINE', // New view for 6-Step Routine
  MARKET_REPORT = 'MARKET_REPORT', // New view for Market Updates
  LANDING = 'LANDING'
}

export interface ModuleProgress {
  slides: boolean;
  video: boolean;
}

export interface UserProfile {
  username: string;
  friendlyName: string;
  memberLevel: string;
  completedModules: string[]; // Array of CourseModule IDs
  moduleProgress?: Record<string, ModuleProgress>; // Track partial completion
  apiKeys?: {
    tradier?: string;
  };
}

export interface StockFundamentalAnalysis {
  id: string;
  symbol: string;
  name: string;
  dateAdded: string;
  
  // OA Criteria
  overview: string;
  avgVolume: string; // Target: > 1M
  institutionalOwnership: string; // Target: > 50%
  earningsDate: string;
  range52Week: string;
  
  // Financial Health & Valuation (New)
  debtToEquity: string;
  peRatio: string;
  dividend: string;
  intrinsicValue: string;
  analystTargetPrice: string; // New field

  // Management Performance (New)
  management: {
    roic: string;
    roa: string;
    roe: string;
  };
  
  // Growth Trends
  growth: {
    currentQtr: string;
    nextQtr: string;
    currentYear: string;
    nextYear: string;
    next5Years: string;
    past5Years: string;
    industryAvg: string;
  };

  notes: string;
}

export interface TradingPlan {
  id: string;
  symbol: string;
  date: string;
  status: 'Draft' | 'Completed' | 'Graded';
  
  // Step 1: Determine Direction
  step1: {
    fundamentals: string;
    technicals: string;
    sentiment: string;
    conclusion: 'Bullish' | 'Bearish' | 'Neutral' | 'Stagnant';
  };
  
  // Step 2: Analyze Possibilities
  step2: {
    impliedVolatility: 'Low' | 'Medium' | 'High';
    candidateStrategies: string[];
  };

  // Step 3: Structure Strategy
  step3: {
    selectedStrategy: string;
    strikes: string;
    expiration: string;
    riskRewardRatio: string;
  };

  // Step 4: Exits
  step4: {
    primaryExit: string;
    secondaryExitBullish: string;
    secondaryExitBearish: string;
  };

  // Step 5 & 6
  step5_6: {
    placementNotes: string;
    monitoringPlan: string;
  };

  aiFeedback?: string;
}
