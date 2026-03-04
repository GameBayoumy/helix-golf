"use client";

import { useCallback, useEffect, useEffectEvent, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Code2,
  Keyboard,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";

import { challenges } from "@/challenges";
import HelixEditor from "@/components/HelixEditor";
import {
  challengeRuntimeReducer,
  createChallengeRuntimeState,
} from "@/lib/challenge-runtime";
import type { EditorSnapshot } from "@/lib/helix-engine";
import { useStoredProgress } from "@/lib/use-progress";
import { Challenge } from "@/types/challenge";

interface ChallengePageClientProps {
  challenge: Challenge;
}

export default function ChallengePageClient({
  challenge,
}: ChallengePageClientProps) {
  const router = useRouter();
  const persistedCompletionKey = useRef<string | null>(null);
  const [state, dispatch] = useReducer(
    challengeRuntimeReducer,
    challenge,
    (initialChallenge) => createChallengeRuntimeState(initialChallenge, Date.now()),
  );
  const { recordCompletion, markVisited, getChallengeProgress } = useStoredProgress(
    challenges.map((entry) => entry.id),
  );
  const [now, setNow] = useState(() => Date.now());
  const persistVisit = useEffectEvent(() => {
    markVisited(challenge.id);
  });
  const persistCompletion = useEffectEvent(() => {
    if (!state.result) {
      return;
    }

    const completionKey = `${challenge.id}:${state.result.keystrokes}:${state.result.timeMs}:${state.result.hintsUsed}`;
    if (persistedCompletionKey.current === completionKey) {
      return;
    }

    persistedCompletionKey.current = completionKey;
    recordCompletion(challenge.id, state.result);
  });

  useEffect(() => {
    dispatch({ type: "load", challenge, now: Date.now() });
    persistedCompletionKey.current = null;
  }, [challenge]);

  useEffect(() => {
    persistVisit();
  }, [challenge.id]);

  useEffect(() => {
    persistCompletion();
  }, [state.result]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const currentIndex = challenges.findIndex((entry) => entry.id === challenge.id);
  const elapsedSeconds = Math.floor((now - state.startTime) / 1000);
  const savedProgress = getChallengeProgress(challenge.id);
  const handleContentChange = useCallback(() => {}, []);
  const handleKeystroke = useCallback((key: string) => {
    dispatch({ type: "record-key", key, now: Date.now() });
  }, []);
  const handleSnapshotChange = useCallback((snapshot: EditorSnapshot) => {
    dispatch({ type: "update-snapshot", snapshot, now: Date.now() });
  }, []);

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      router.push(`/challenge/${challenges[currentIndex + 1].id}`);
      return;
    }
    router.push("/");
  };

  return (
    <div className="app-frame">
      <header className="border-b border-subtle bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted transition-colors hover:text-[var(--text-default)]"
              >
                <ArrowLeft size={18} />
                <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                  Back
                </span>
              </Link>

              <div className="h-6 w-px bg-border-subtle" />

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-surface-strong p-2">
                  <Code2 className="text-[var(--editor-text)]" size={18} />
                </div>
                <div>
                  <h1 className="font-semibold text-[var(--text-default)]" style={{ fontFamily: "var(--font-mono)" }}>
                    {state.challenge.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-surface-subtle px-2 py-0.5 text-xs text-muted">
                      {state.challenge.difficulty}
                    </span>
                    <span className="text-xs text-subtle">{state.challenge.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: "toggle-goal" })}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                state.showGoal
                  ? "border-surface-strong bg-surface-strong text-white"
                  : "border-subtle bg-white text-muted hover:border-[var(--text-default)]"
              }`}
              type="button"
            >
              <Target size={16} />
              {state.showGoal ? "Hide Goal" : "Show Goal"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="panel-card p-4">
              <p className="text-muted">{state.challenge.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.challenge.supportedCommands.map((command) => (
                  <code
                    key={command}
                    className="rounded bg-surface-subtle px-2 py-1 text-xs font-mono text-[var(--color-terracotta)]"
                  >
                    {command}
                  </code>
                ))}
              </div>
            </div>

            <div className="panel-card overflow-hidden">
              <div className="panel-muted flex items-center justify-between px-4 py-2">
                <span className="text-sm text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                  editor
                </span>
                <div className="flex items-center gap-4 text-xs text-subtle">
                  <span className="flex items-center gap-1">
                    <Keyboard size={12} />
                    {state.keystrokes.length} keystrokes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="h-[420px]">
                <HelixEditor
                  initialContent={state.challenge.initial}
                  initialSelections={state.challenge.initialSelections}
                  onContentChange={handleContentChange}
                  onKeystroke={handleKeystroke}
                  onStateChange={handleSnapshotChange}
                  resetKey={`${state.challenge.id}-${state.resetToken}`}
                />
              </div>
            </div>

            {state.showGoal && (
              <div className="panel-card overflow-hidden">
                <div
                  className="border-b px-4 py-2"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-sage) 20%, transparent)",
                    backgroundColor: "color-mix(in srgb, var(--color-sage) 10%, white)",
                  }}
                >
                  <span
                    className="text-sm font-medium text-[var(--color-sage)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Goal
                  </span>
                </div>
                <div className="space-y-3 p-4 text-sm text-muted">
                  {state.challenge.goal.buffer !== undefined && (
                    <div>
                      <div className="mb-2 text-xs uppercase tracking-wide text-subtle">Target Buffer</div>
                      <pre className="overflow-auto rounded border border-subtle bg-surface-page p-3 text-[var(--text-default)]">
                        {state.challenge.goal.buffer}
                      </pre>
                    </div>
                  )}
                  {state.challenge.goal.cursor && (
                    <div>
                      Cursor: line {state.challenge.goal.cursor.line + 1}, column {state.challenge.goal.cursor.column + 1}
                    </div>
                  )}
                  {state.challenge.goal.selections && (
                    <div>
                      Selection target:
                      {" "}
                      {state.challenge.goal.selections
                        .map(
                          (selection) =>
                            `(${selection.start.line + 1}:${selection.start.column + 1}) -> (${selection.end.line + 1}:${selection.end.column + 1})`,
                        )
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="panel-card overflow-hidden">
              <div className="panel-muted flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-[var(--color-mustard)]" />
                  <span className="text-sm font-medium text-[var(--text-default)]">Hints</span>
                  <span className="text-xs text-subtle">
                    ({state.hintsUsed}/{state.challenge.hints.length} used)
                  </span>
                </div>

                {state.hintsUsed < state.challenge.hints.length && !state.result && (
                  <button
                    onClick={() => dispatch({ type: "use-hint" })}
                    className="rounded bg-color-mustard px-3 py-1 text-xs text-white transition-colors hover:opacity-90"
                    type="button"
                  >
                    Reveal Hint
                  </button>
                )}
              </div>

              <div className="space-y-2 p-4">
                {state.hintsUsed === 0 ? (
                  <p className="text-sm italic text-subtle">No hints used yet. Try the challenge first.</p>
                ) : (
                  state.challenge.hints.slice(0, state.hintsUsed).map((hint, index) => (
                    <div key={hint} className="flex items-start gap-2 text-sm">
                      <span className="font-mono text-[var(--color-mustard)]">{index + 1}.</span>
                      <span className="text-muted">{hint}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel-card p-6">
              {state.result ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-color-sage">
                    <Check size={32} className="text-white" />
                  </div>

                  <h3
                    className="mb-2 text-xl font-bold text-[var(--text-default)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Completed
                  </h3>

                  <p className="mb-6 text-muted">You matched the challenge goal with the live Helix engine.</p>

                  <div className="mb-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Your keystrokes:</span>
                      <span className="font-mono font-semibold">{state.result.keystrokes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Optimal:</span>
                      <span className="font-mono text-[var(--color-sage)]">{state.result.optimalKeystrokes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Hints used:</span>
                      <span className="font-mono">{state.result.hintsUsed}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => dispatch({ type: "reset", now: Date.now() })}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-subtle px-4 py-2 text-muted transition-colors hover:border-[var(--text-default)]"
                      type="button"
                    >
                      <RotateCcw size={16} />
                      Retry
                    </button>

                    <button
                      onClick={handleNext}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-surface-strong px-4 py-2 text-white transition-colors hover:opacity-90"
                      type="button"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <Trophy size={24} className="text-[var(--color-mustard)]" />
                    <div>
                      <h3 className="font-semibold text-[var(--text-default)]">In Progress</h3>
                      <p className="text-sm text-muted">Match the stated buffer, cursor, or selection goal.</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-subtle py-2">
                      <span className="text-muted">Keystrokes</span>
                      <span className="font-mono font-semibold">{state.keystrokes.length}</span>
                    </div>
                    <div className="flex justify-between border-b border-subtle py-2">
                      <span className="text-muted">Cursor</span>
                      <span className="font-mono">
                        {state.snapshot.cursor.line + 1}:{state.snapshot.cursor.column + 1}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-subtle py-2">
                      <span className="text-muted">Selections</span>
                      <span className="font-mono">{state.snapshot.selectionGoals.length}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted">Mode</span>
                      <span className="font-mono uppercase">{state.snapshot.mode}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch({ type: "reset", now: Date.now() })}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-subtle px-4 py-2 text-muted transition-colors hover:border-[var(--text-default)]"
                    type="button"
                  >
                    <RotateCcw size={16} />
                    Reset Challenge
                  </button>
                </div>
              )}
            </div>

            <div className="panel-card p-4">
              <h4 className="mb-3 font-medium text-[var(--text-default)]">Challenge Progress</h4>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
                <div
                  className="h-full bg-color-terracotta transition-all duration-500"
                  style={{
                    width: `${((currentIndex + 1) / challenges.length) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-subtle">
                {currentIndex + 1} of {challenges.length} challenges
              </p>
            </div>

            <div className="panel-card p-4">
              <h4 className="mb-3 font-medium text-[var(--text-default)]">Saved Record</h4>
              {savedProgress ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Completions</span>
                    <span className="font-mono">{savedProgress.completionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Best keys</span>
                    <span className="font-mono">{savedProgress.bestKeystrokes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Best time</span>
                    <span className="font-mono">
                      {Math.round(savedProgress.bestTimeMs / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Fewest hints</span>
                    <span className="font-mono">{savedProgress.lowestHintsUsed}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-subtle">No saved completion yet for this challenge.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
