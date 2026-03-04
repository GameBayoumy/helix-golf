"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  PROGRESS_STORAGE_KEY,
  createEmptyProgress,
  getChallengeProgress,
  getProgressSummary,
  markChallengeVisited,
  readProgress,
  recordChallengeCompletion,
  writeProgress,
} from "@/lib/progress";
import { ChallengeResult } from "@/types/challenge";

export function useStoredProgress(orderedChallengeIds: string[]) {
  const progress = useSyncExternalStore(
    subscribeToProgress,
    () => readProgress(),
    createEmptyProgress,
  );

  const summary = getProgressSummary(progress, orderedChallengeIds);

  const save = useCallback((next: ReturnType<typeof readProgress>) => {
    writeProgress(next);
    notifyProgressSubscribers();
  }, []);

  const markVisited = useCallback((challengeId: string) => {
    const next = markChallengeVisited(progress, challengeId, new Date().toISOString());
    if (next !== progress) {
      save(next);
    }
  }, [progress, save]);

  const recordCompletion = useCallback((challengeId: string, result: ChallengeResult) => {
    const next = recordChallengeCompletion(
      progress,
      challengeId,
      result,
      new Date().toISOString(),
    );
    save(next);
  }, [progress, save]);

  const resetProgress = useCallback(() => {
    save(createEmptyProgress());
  }, [save]);

  return {
    progress,
    summary,
    markVisited,
    recordCompletion,
    resetProgress,
    getChallengeProgress: (challengeId: string) => getChallengeProgress(progress, challengeId),
  };
}

const listeners = new Set<() => void>();

function subscribeToProgress(listener: () => void) {
  listeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      listeners.delete(listener);
    };
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === PROGRESS_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function notifyProgressSubscribers() {
  for (const listener of listeners) {
    listener();
  }
}
