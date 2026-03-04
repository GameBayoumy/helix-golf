"use client";

import Link from "next/link";
import { BarChart3, RotateCcw, Sparkles } from "lucide-react";

import { useStoredProgress } from "@/lib/use-progress";

interface ProgressSummaryCardProps {
  challengeIds: string[];
}

export default function ProgressSummaryCard({
  challengeIds,
}: ProgressSummaryCardProps) {
  const { summary, resetProgress } = useStoredProgress(challengeIds);

  return (
    <div className="panel-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-surface-subtle p-2">
          <BarChart3 size={18} className="text-[var(--color-terracotta)]" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--text-default)]" style={{ fontFamily: "var(--font-mono)" }}>
            Your Progress
          </h2>
          <p className="text-sm text-muted">Saved in your browser.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Completed" value={`${summary.completedCount}/${summary.totalCount}`} />
        <Stat label="Completion" value={`${Math.round(summary.completionRate * 100)}%`} />
        <Stat label="Path Streak" value={`${summary.currentStreak}`} />
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
        <div
          className="h-full bg-color-terracotta transition-all duration-500"
          style={{ width: `${Math.round(summary.completionRate * 100)}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        {summary.lastPlayedChallengeId ? (
          <Link
            href={`/challenge/${summary.lastPlayedChallengeId}`}
            className="inline-flex items-center gap-2 text-[var(--color-terracotta)] transition-colors hover:text-[var(--terracotta-dark)]"
          >
            <Sparkles size={14} />
            Resume last challenge
          </Link>
        ) : (
          <span className="text-subtle">No saved challenge yet.</span>
        )}

        {summary.completedCount > 0 && (
          <button
            type="button"
            onClick={resetProgress}
            className="inline-flex items-center gap-2 text-muted transition-colors hover:text-[var(--text-default)]"
          >
            <RotateCcw size={14} />
            Reset progress
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-subtle p-4">
      <div className="text-xs uppercase tracking-wide text-subtle">{label}</div>
      <div className="mt-1 font-mono text-xl font-semibold text-[var(--text-default)]">{value}</div>
    </div>
  );
}
