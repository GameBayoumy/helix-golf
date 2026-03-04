import {
  createEngineState,
  createSnapshot,
  EditorSnapshot,
} from "@/lib/helix-engine";
import { validateGoal } from "@/lib/validator";
import { Challenge, ChallengeResult, Keystroke } from "@/types/challenge";

export interface ChallengeRuntimeState {
  challenge: Challenge;
  snapshot: EditorSnapshot;
  keystrokes: Keystroke[];
  startTime: number;
  hintsUsed: number;
  result: ChallengeResult | null;
  showGoal: boolean;
  resetToken: number;
}

type ChallengeRuntimeAction =
  | { type: "load"; challenge: Challenge; now: number }
  | { type: "record-key"; key: string; now: number }
  | { type: "update-snapshot"; snapshot: EditorSnapshot; now: number }
  | { type: "toggle-goal" }
  | { type: "use-hint" }
  | { type: "reset"; now: number };

export function createChallengeRuntimeState(
  challenge: Challenge,
  now: number,
): ChallengeRuntimeState {
  return {
    challenge,
    snapshot: createSnapshot(
      createEngineState(challenge.initial, challenge.initialSelections),
    ),
    keystrokes: [],
    startTime: now,
    hintsUsed: 0,
    result: null,
    showGoal: false,
    resetToken: 0,
  };
}

export function challengeRuntimeReducer(
  state: ChallengeRuntimeState,
  action: ChallengeRuntimeAction,
): ChallengeRuntimeState {
  switch (action.type) {
    case "load":
      return createChallengeRuntimeState(action.challenge, action.now);
    case "record-key":
      return {
        ...state,
        keystrokes: [...state.keystrokes, { key: action.key, timestamp: action.now }],
      };
    case "update-snapshot":
      return maybeComplete({
        ...state,
        snapshot: action.snapshot,
      }, action.now);
    case "toggle-goal":
      return { ...state, showGoal: !state.showGoal };
    case "use-hint":
      if (state.result || state.hintsUsed >= state.challenge.hints.length) {
        return state;
      }
      return { ...state, hintsUsed: state.hintsUsed + 1 };
    case "reset":
      return {
        ...createChallengeRuntimeState(state.challenge, action.now),
        resetToken: state.resetToken + 1,
      };
    default:
      return state;
  }
}

function maybeComplete(
  state: ChallengeRuntimeState,
  now: number,
): ChallengeRuntimeState {
  if (state.result || !validateGoal(state.challenge.goal, state.snapshot)) {
    return state;
  }

  return {
    ...state,
    result: {
      completed: true,
      keystrokes: state.keystrokes.length,
      optimalKeystrokes: state.challenge.optimalKeystrokes,
      timeMs: now - state.startTime,
      hintsUsed: state.hintsUsed,
    },
  };
}
