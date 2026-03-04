import { describe, expect, it } from "vitest";

import { challenges } from "@/challenges";
import { createSnapshot } from "@/lib/helix-engine";
import { validateGoal } from "@/lib/validator";

import { pressKeys } from "./test-helpers";

const solutions: Record<string, string[]> = {
  "basic-hjkl": ["j", "j"],
  "word-navigation": ["w", "w", "w"],
  "find-char": ["f", "="],
  "select-line": ["x"],
  "extend-line-bounds": ["X"],
  "delete-line": ["x", "d"],
  "replace-char": ["r", "e"],
  "join-lines": ["J"],
  "indent-line": ["x", ">"],
  "match-inside": ["m", "i", "(", "c", "n", "e", "w", "Escape"],
  "match-around": ["m", "a", "[", "c", "n", "e", "w", "_", "v", "a", "l", "u", "e", "Escape"],
  "add-surround": ["m", "s", "\""],
  "multiple-cursors": ["C", "C", "c", "b", "a", "r", "Escape"],
  "regex-select": ["%", "s", "f", "o", "o", "Enter", "c", "b", "a", "z", "Escape"],
};

describe("challenge definitions", () => {
  it("have a verified canonical solution for every challenge", () => {
    expect(new Set(challenges.map((challenge) => challenge.id)).size).toBe(challenges.length);

    for (const challenge of challenges) {
      const keys = solutions[challenge.id];
      expect(keys, `Missing solution for ${challenge.id}`).toBeDefined();

      const state = pressKeys(challenge.initial, keys, challenge.initialSelections);
      const snapshot = createSnapshot(state);

      expect(validateGoal(challenge.goal, snapshot), challenge.id).toBe(true);
      expect(challenge.optimalKeystrokes, `${challenge.id} optimal keystrokes`).toBe(keys.length);
    }
  });
});
