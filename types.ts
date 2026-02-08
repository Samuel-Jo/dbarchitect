export enum StageType {
  INTRO = 'INTRO',
  PERSISTENCE = 'PERSISTENCE',
  TERMINOLOGY = 'TERMINOLOGY',
  KEYS_INDEX = 'KEYS_INDEX',
  SCENARIOS = 'SCENARIOS',
  COMPLETION = 'COMPLETION'
}

export type ApiProvider = 'GEMINI' | 'OPENAI';

export interface ReviewItem {
  id: string;
  stage: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface GameState {
  currentStage: StageType;
  score: number;
  maxScore: number;
  userName: string;
  reviewItems: ReviewItem[];
  difficultyLevel: number; // 1 | 2 | 3 | 4
  apiKey?: string;
  apiProvider?: ApiProvider;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string; // The correct match
  difficulty: number;
}

export interface PersistenceItem {
  id: number;
  text: string;
  type: 'RAM' | 'DISK';
  explanation: string;
  difficulty: number;
}

export interface PersistenceEssay {
  id: string;
  difficulty: number;
  question: string;
  context: string; // The core concept for AI evaluation
  modelAnswer: string; // For the user to see after getting feedback or for AI context
}

export interface TableScenario {
  id: string;
  title: string;
  columns: { id: string; label: string; isPk: boolean; value: string }[];
  searchTarget: string;
  difficulty: number;
}

export interface TechScenario {
  id: number;
  desc: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
  difficulty: number;
}