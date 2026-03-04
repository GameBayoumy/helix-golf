import { ChallengeResult } from "@/types/challenge";

export const PROGRESS_STORAGE_KEY = "helix-dojo-progress";
const PROGRESS_VERSION = 1;
const EMPTY_PROGRESS: StoredProgress = {
  version: PROGRESS_VERSION,
  updatedAt: "",
  lastPlayedChallengeId: null,
  challenges: {},
};
let cachedRawProgress: string | null = null;
let cachedProgressSnapshot: StoredProgress = EMPTY_PROGRESS;

export interface StoredChallengeProgress {
  challengeId: string;
  completedAt: string;
  completionCount: number;
  bestKeystrokes: number;
  bestTimeMs: number;
  lowestHintsUsed: number;
  lastResult: ChallengeResult;
}

export interface StoredProgress {
  version: number;
  updatedAt: string;
  lastPlayedChallengeId: string | null;
  challenges: Record<string, StoredChallengeProgress>;
}

export interface ProgressSummary {
  completedCount: number;
  totalCount: number;
  completionRate: number;
  currentStreak: number;
  lastPlayedChallengeId: string | null;
}

export function createEmptyProgress(): StoredProgress {
  return EMPTY_PROGRESS;
}

export function readProgress(storage?: Pick<Storage, "getItem"> | null): StoredProgress {
  const target = storage ?? getBrowserStorage();
  if (!target) {
    return cachedProgressSnapshot;
  }

  try {
    const raw = target.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      cachedRawProgress = null;
      cachedProgressSnapshot = EMPTY_PROGRESS;
      return cachedProgressSnapshot;
    }
    if (raw === cachedRawProgress) {
      return cachedProgressSnapshot;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredProgress(parsed)) {
      cachedRawProgress = null;
      cachedProgressSnapshot = EMPTY_PROGRESS;
      return cachedProgressSnapshot;
    }
    cachedRawProgress = raw;
    cachedProgressSnapshot = parsed;
    return cachedProgressSnapshot;
  } catch {
    cachedRawProgress = null;
    cachedProgressSnapshot = EMPTY_PROGRESS;
    return cachedProgressSnapshot;
  }
}

export function writeProgress(
  progress: StoredProgress,
  storage?: Pick<Storage, "setItem"> | null,
) {
  const target = storage ?? getBrowserStorage();
  if (!target) {
    return;
  }

  try {
    const raw = JSON.stringify(progress);
    target.setItem(PROGRESS_STORAGE_KEY, raw);
    cachedRawProgress = raw;
    cachedProgressSnapshot = progress;
  } catch {
    // Ignore storage failures so challenge flow still works offline/private mode.
  }
}

export function recordChallengeCompletion(
  progress: StoredProgress,
  challengeId: string,
  result: ChallengeResult,
  completedAt: string,
): StoredProgress {
  const existing = progress.challenges[challengeId];
  const nextEntry: StoredChallengeProgress = existing
    ? {
        ...existing,
        completedAt,
        completionCount: existing.completionCount + 1,
        bestKeystrokes: Math.min(existing.bestKeystrokes, result.keystrokes),
        bestTimeMs: Math.min(existing.bestTimeMs, result.timeMs),
        lowestHintsUsed: Math.min(existing.lowestHintsUsed, result.hintsUsed),
        lastResult: result,
      }
    : {
        challengeId,
        completedAt,
        completionCount: 1,
        bestKeystrokes: result.keystrokes,
        bestTimeMs: result.timeMs,
        lowestHintsUsed: result.hintsUsed,
        lastResult: result,
      };

  return {
    ...progress,
    updatedAt: completedAt,
    lastPlayedChallengeId: challengeId,
    challenges: {
      ...progress.challenges,
      [challengeId]: nextEntry,
    },
  };
}

export function markChallengeVisited(
  progress: StoredProgress,
  challengeId: string,
  updatedAt: string,
): StoredProgress {
  if (progress.lastPlayedChallengeId === challengeId) {
    return progress;
  }

  return {
    ...progress,
    updatedAt,
    lastPlayedChallengeId: challengeId,
  };
}

export function getChallengeProgress(
  progress: StoredProgress,
  challengeId: string,
): StoredChallengeProgress | null {
  return progress.challenges[challengeId] ?? null;
}

export function getProgressSummary(
  progress: StoredProgress,
  orderedChallengeIds: string[],
): ProgressSummary {
  const completedIds = new Set(Object.keys(progress.challenges));
  const completedCount = orderedChallengeIds.filter((id) => completedIds.has(id)).length;
  const currentStreak = countLeadingSolved(orderedChallengeIds, completedIds);

  return {
    completedCount,
    totalCount: orderedChallengeIds.length,
    completionRate:
      orderedChallengeIds.length === 0 ? 0 : completedCount / orderedChallengeIds.length,
    currentStreak,
    lastPlayedChallengeId: progress.lastPlayedChallengeId,
  };
}

function countLeadingSolved(
  orderedChallengeIds: string[],
  completedIds: Set<string>,
): number {
  let streak = 0;
  for (const id of orderedChallengeIds) {
    if (!completedIds.has(id)) {
      break;
    }
    streak += 1;
  }
  return streak;
}

function getBrowserStorage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function isStoredProgress(value: unknown): value is StoredProgress {
  if (!value || typeof value !== "object") {
    return false;
  }

  const progress = value as Partial<StoredProgress>;
  return (
    progress.version === PROGRESS_VERSION &&
    typeof progress.updatedAt === "string" &&
    (typeof progress.lastPlayedChallengeId === "string" ||
      progress.lastPlayedChallengeId === null) &&
    !!progress.challenges &&
    typeof progress.challenges === "object"
  );
}
