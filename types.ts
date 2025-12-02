export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ImageAnalysisState {
  isAnalyzing: boolean;
  result: string | null;
  error: string | null;
  imageUrl: string | null;
}

export enum AppSection {
  HOME = 'home',
  SOLUTIONS = 'solutions',
  VISION = 'vision',
  CONTACT = 'contact'
}

export interface User {
  name: string;
  email: string;
}