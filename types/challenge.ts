export interface Position {
  line: number;
  column: number;
}

export interface SelectionState {
  anchor: Position;
  head: Position;
}

export interface SelectionGoal {
  start: Position;
  end: Position;
}

export interface ChallengeGoal {
  buffer?: string;
  cursor?: Position;
  selections?: SelectionGoal[];
  mode?: "normal" | "select";
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: "movement" | "selection" | "change" | "surround" | "multicursor";
  initial: string;
  initialSelections?: SelectionState[];
  goal: ChallengeGoal;
  hints: string[];
  optimalKeystrokes: number;
  supportedCommands: string[];
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
