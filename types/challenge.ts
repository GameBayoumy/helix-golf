export interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initial: string;
  target: string;
  hints: string[];
  optimalKeystrokes: number;
  category: 'movement' | 'selection' | 'change' | 'surround' | 'multicursor';
}

export interface HelixMode {
  type: 'normal' | 'insert' | 'select' | 'goto' | 'match' | 'view';
  subMode?: string;
}

export interface Keystroke {
  key: string;
  timestamp: number;
}

export interface ChallengeResult {
  completed: boolean;
  keystrokes: number;
  optimalKeystrokes: number;
  timeMs: number;
  hintsUsed: number;
}
