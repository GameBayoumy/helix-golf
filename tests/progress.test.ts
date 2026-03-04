import { describe, expect, it } from "vitest";

import {
  createEmptyProgress,
  getChallengeProgress,
  getProgressSummary,
  markChallengeVisited,
  readProgress,
  recordChallengeCompletion,
} from "@/lib/progress";
import { ChallengeResult } from "@/types/challenge";

const sampleResult: ChallengeResult = {
  completed: true,
  keystrokes: 8,
  optimalKeystrokes: 6,
  timeMs: 12000,
  hintsUsed: 1,
};

describe("progress persistence", () => {
  it("returns an empty progress state for invalid storage data", () => {
    const progress = readProgress({
      getItem: () => "{not-json",
    });

    expect(progress).toEqual(createEmptyProgress());
  });

  it("records completions and preserves best metrics", () => {
    const first = recordChallengeCompletion(
      createEmptyProgress(),
      "basic-hjkl",
      sampleResult,
      "2026-03-04T10:00:00.000Z",
    );
    const second = recordChallengeCompletion(
      first,
      "basic-hjkl",
      {
        ...sampleResult,
        keystrokes: 6,
        timeMs: 9000,
        hintsUsed: 0,
      },
      "2026-03-04T10:05:00.000Z",
    );

    expect(getChallengeProgress(second, "basic-hjkl")).toEqual({
      challengeId: "basic-hjkl",
      completedAt: "2026-03-04T10:05:00.000Z",
      completionCount: 2,
      bestKeystrokes: 6,
      bestTimeMs: 9000,
      lowestHintsUsed: 0,
      lastResult: {
        ...sampleResult,
        keystrokes: 6,
        timeMs: 9000,
        hintsUsed: 0,
      },
    });
  });

  it("computes summary and streak from ordered challenge ids", () => {
    let progress = createEmptyProgress();
    progress = recordChallengeCompletion(
      progress,
      "basic-hjkl",
      sampleResult,
      "2026-03-04T10:00:00.000Z",
    );
    progress = recordChallengeCompletion(
      progress,
      "word-navigation",
      sampleResult,
      "2026-03-04T10:01:00.000Z",
    );
    progress = markChallengeVisited(progress, "find-char", "2026-03-04T10:02:00.000Z");

    expect(
      getProgressSummary(progress, [
        "basic-hjkl",
        "word-navigation",
        "find-char",
        "select-line",
      ]),
    ).toEqual({
      completedCount: 2,
      totalCount: 4,
      completionRate: 0.5,
      currentStreak: 2,
      lastPlayedChallengeId: "find-char",
    });
  });
});
