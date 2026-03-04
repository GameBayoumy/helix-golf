import { ChallengeGoal } from "@/types/challenge";
import { EditorSnapshot } from "@/lib/helix-engine";

export function validateGoal(goal: ChallengeGoal, snapshot: EditorSnapshot): boolean {
  if (goal.buffer !== undefined && normalize(snapshot.content) !== normalize(goal.buffer)) {
    return false;
  }

  if (goal.cursor) {
    if (
      snapshot.cursor.line !== goal.cursor.line ||
      snapshot.cursor.column !== goal.cursor.column
    ) {
      return false;
    }
  }

  if (goal.mode && snapshot.mode !== goal.mode) {
    return false;
  }

  if (goal.selections) {
    if (snapshot.selectionGoals.length !== goal.selections.length) {
      return false;
    }

    for (let index = 0; index < goal.selections.length; index += 1) {
      const actual = snapshot.selectionGoals[index];
      const expected = goal.selections[index];
      if (
        actual.start.line !== expected.start.line ||
        actual.start.column !== expected.start.column ||
        actual.end.line !== expected.end.line ||
        actual.end.column !== expected.end.column
      ) {
        return false;
      }
    }
  }

  return true;
}

function normalize(value: string): string {
  return value.replace(/\r\n/g, "\n");
}

export function calculateScore(
  keystrokes: number,
  optimalKeystrokes: number,
  hintsUsed: number,
  timeMs: number,
): number {
  let score = 1000;
  score -= Math.max(0, (keystrokes - optimalKeystrokes) * 10);
  score -= hintsUsed * 100;
  score -= Math.max(0, timeMs / 1000 - 30);
  return Math.max(0, Math.round(score));
}

export function getStarRating(
  keystrokes: number,
  optimalKeystrokes: number,
  hintsUsed: number,
): number {
  if (hintsUsed > 0) {
    return 1;
  }
  if (keystrokes <= optimalKeystrokes) {
    return 3;
  }
  if (keystrokes <= optimalKeystrokes + 3) {
    return 2;
  }
  return 1;
}

export function getDifficultyColor(difficulty: "easy" | "medium" | "hard"): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "hard":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}
