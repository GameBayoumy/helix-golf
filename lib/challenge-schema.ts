import { supportedCommandTokens } from "@/lib/command-catalog";
import {
  Challenge,
  ChallengeGoal,
  Position,
  SelectionGoal,
  SelectionState,
} from "@/types/challenge";

export function validateChallenges(challenges: Challenge[]): Challenge[] {
  const ids = new Set<string>();

  return challenges.map((challenge, index) => {
    assertChallenge(challenge, index);

    if (ids.has(challenge.id)) {
      throw new Error(`Duplicate challenge id "${challenge.id}".`);
    }
    ids.add(challenge.id);

    for (const command of challenge.supportedCommands) {
      if (!supportedCommandTokens.has(command)) {
        throw new Error(
          `Challenge "${challenge.id}" references unsupported command "${command}".`,
        );
      }
    }

    return challenge;
  });
}

function assertChallenge(challenge: Challenge, index: number) {
  if (!challenge.id) {
    throw new Error(`Challenge at index ${index} is missing an id.`);
  }
  if (!challenge.name) {
    throw new Error(`Challenge "${challenge.id}" is missing a name.`);
  }
  if (!challenge.initial && challenge.initial !== "") {
    throw new Error(`Challenge "${challenge.id}" is missing initial content.`);
  }
  if (challenge.optimalKeystrokes < 1) {
    throw new Error(`Challenge "${challenge.id}" must have a positive optimal keystroke count.`);
  }
  if (challenge.hints.length === 0) {
    throw new Error(`Challenge "${challenge.id}" must include at least one hint.`);
  }
  if (challenge.supportedCommands.length === 0) {
    throw new Error(`Challenge "${challenge.id}" must declare supported commands.`);
  }

  challenge.initialSelections?.forEach((selection, selectionIndex) => {
    assertSelectionState(selection, `challenge "${challenge.id}" initial selection ${selectionIndex}`);
  });
  assertGoal(challenge.goal, challenge.id);
}

function assertGoal(goal: ChallengeGoal, challengeId: string) {
  if (
    goal.buffer === undefined &&
    goal.cursor === undefined &&
    goal.selections === undefined &&
    goal.mode === undefined
  ) {
    throw new Error(`Challenge "${challengeId}" has an empty goal.`);
  }

  if (goal.cursor) {
    assertPosition(goal.cursor, `challenge "${challengeId}" goal cursor`);
  }

  goal.selections?.forEach((selection, index) => {
    assertSelectionGoal(selection, `challenge "${challengeId}" goal selection ${index}`);
  });
}

function assertSelectionState(selection: SelectionState, label: string) {
  assertPosition(selection.anchor, `${label} anchor`);
  assertPosition(selection.head, `${label} head`);
}

function assertSelectionGoal(selection: SelectionGoal, label: string) {
  assertPosition(selection.start, `${label} start`);
  assertPosition(selection.end, `${label} end`);
}

function assertPosition(position: Position, label: string) {
  if (position.line < 0 || position.column < 0) {
    throw new Error(`${label} must use non-negative coordinates.`);
  }
}
