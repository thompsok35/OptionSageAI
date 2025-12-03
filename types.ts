
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
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PLAYER = 'PLAYER',
  LIBRARY = 'LIBRARY',
  PROFILE = 'PROFILE',
  GRADUATION = 'GRADUATION'
}

export interface UserProfile {
  username: string;
  friendlyName: string;
  memberLevel: string;
  completedModules: string[]; // Array of CourseModule IDs
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
