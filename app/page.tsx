import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  Keyboard,
  Layers,
  Target,
  Terminal,
  Zap,
} from "lucide-react";

import InteractiveHeroDemo from "@/app/components/InteractiveHeroDemo";
import { challenges } from "@/challenges";
import ProgressSummaryCard from "@/components/ProgressSummaryCard";
import { challengeCategoryMeta } from "@/lib/command-catalog";

export default function LandingPage() {
  const firstChallenge = challenges[0];

  return (
    <div className="app-frame">
      <nav className="border-b border-subtle bg-surface-page">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-[var(--text-default)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              helix
            </span>
            <span
              className="text-lg font-semibold text-[var(--color-terracotta)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              dojo
            </span>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/tutorial" className="text-sm text-muted transition-colors hover:text-[var(--text-default)]">
              Tutorial
            </Link>
            <Link href="/sandbox" className="text-sm text-muted transition-colors hover:text-[var(--text-default)]">
              Sandbox
            </Link>
            <a
              href="https://helix-editor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-[var(--text-default)]"
            >
              Documentation
            </a>
          </div>
        </div>
      </nav>

      <section className="overflow-hidden pb-24 pt-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:pt-12">
              <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-terracotta)]">
                <span className="h-[2px] w-8 bg-color-terracotta" />
                <span style={{ fontFamily: "var(--font-mono)" }}>
                  {challenges.length} curated challenges
                </span>
              </div>

              <h1
                className="mb-6 text-5xl font-bold leading-[1.1] text-[var(--text-default)] lg:text-6xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                The Art of
                <br />
                <span className="accent-underline">Text Editing</span>
              </h1>

              <p
                className="mb-8 text-lg leading-relaxed text-muted"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Helix is a modal editor built on a simple idea:
                {" "}
                <strong className="text-[var(--text-default)]">select, then act</strong>.
                {" "}
                No Vim legacy. No Emacs chords. Just you and your text.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href={`/challenge/${firstChallenge.id}`} className="btn-primary">
                  <Keyboard className="h-4 w-4" />
                  Start Training
                </Link>

                <Link href="/sandbox" className="btn-secondary">
                  <Terminal className="h-4 w-4" />
                  Free Play
                </Link>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div className="grid-decoration absolute inset-0 opacity-50" />
              <div className="relative z-10">
                <InteractiveHeroDemo />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <ProgressSummaryCard challengeIds={challenges.map((challenge) => challenge.id)} />
          </div>
        </div>
      </section>

      <section className="bg-surface-subtle py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span
                className="mb-2 block text-sm text-[var(--color-terracotta)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                01 - The Path
              </span>
              <h2
                className="text-3xl font-bold text-[var(--text-default)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Five Disciplines
              </h2>
            </div>
            <Link
              href="/sandbox"
              className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-[var(--text-default)]"
            >
              View Sandbox <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {challengeCategoryMeta.map((category, index) => {
              const count = challenges.filter((challenge) => challenge.category === category.id).length;
              const firstCategoryChallenge = challenges.find(
                (challenge) => challenge.category === category.id,
              );

              return (
                <Link
                  key={category.id}
                  href={firstCategoryChallenge ? `/challenge/${firstCategoryChallenge.id}` : "/sandbox"}
                  className="card-editorial group flex flex-col p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="text-4xl font-bold text-[var(--border-subtle)] transition-colors group-hover:text-[var(--color-terracotta)]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {renderCategoryIcon(category.id)}
                  </div>

                  <h3
                    className="mb-1 font-semibold text-[var(--text-default)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {category.name}
                  </h3>

                  <p className="mb-4 text-sm text-muted">{category.desc}</p>

                  <div className="mt-auto border-t border-subtle pt-4">
                    <span className="text-xs text-subtle">{count} exercises</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span
              className="mb-2 block text-sm text-[var(--color-terracotta)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              02 - Practice
            </span>
            <h2
              className="mb-4 text-3xl font-bold text-[var(--text-default)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Begin with the Fundamentals
            </h2>

            <p className="text-muted" style={{ fontFamily: "var(--font-sans)" }}>
              Master these core concepts before advancing to complex multi-step transformations.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {challenges.slice(0, 5).map((challenge, index) => (
              <Link
                key={challenge.id}
                href={`/challenge/${challenge.id}`}
                className="group flex items-center gap-6 rounded-lg border border-subtle bg-white p-6 transition-all hover:border-[var(--color-terracotta)]"
              >
                <span
                  className="w-12 text-2xl font-bold text-[var(--border-subtle)] transition-colors group-hover:text-[var(--color-terracotta)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <h4
                      className="font-semibold text-[var(--text-default)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {challenge.name}
                    </h4>

                    <span
                      className="rounded px-2 py-0.5 text-xs"
                      style={{
                        background: challenge.difficulty === "easy" ? "#f0ebe4" : "var(--border-subtle)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-muted">{challenge.description}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-subtle">
                  <span>~{challenge.optimalKeystrokes} keys</span>
                  <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-strong py-24 text-[var(--editor-text)]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <BookOpen className="mx-auto mb-6 h-12 w-12 text-[var(--color-terracotta)]" />

          <blockquote
            className="mb-8 text-2xl font-medium leading-relaxed lg:text-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;Helix is not Vim. It is not Emacs. It is a
            {" "}
            <span className="text-[var(--color-terracotta)]">selection-first</span>
            {" "}
            editor built on the principle that you should know what you&apos;re changing
            {" "}
            <em>before</em>
            {" "}
            you change it.&rdquo;
          </blockquote>

          <a
            href="https://helix-editor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-terracotta)] transition-colors hover:text-[var(--terracotta-light)]"
          >
            Read the Helix Philosophy
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-subtle py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[var(--text-default)]" style={{ fontFamily: "var(--font-serif)" }}>
                helix
              </span>
              <span className="text-[var(--color-terracotta)]" style={{ fontFamily: "var(--font-mono)" }}>
                dojo
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted">
              <a href="/terms" className="transition-colors hover:text-[var(--text-default)]">Terms</a>
              <a href="/privacy" className="transition-colors hover:text-[var(--text-default)]">Privacy</a>
              <a
                href="https://github.com/helix-editor/helix"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--text-default)]"
              >
                Helix on GitHub
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-subtle">
            An unofficial training tool. Not affiliated with the Helix Editor project.
          </p>
        </div>
      </footer>
    </div>
  );
}

function renderCategoryIcon(categoryId: (typeof challengeCategoryMeta)[number]["id"]) {
  const className = "h-5 w-5 text-muted transition-colors group-hover:text-[var(--color-terracotta)]";

  switch (categoryId) {
    case "movement":
      return <Target className={className} />;
    case "selection":
      return <Layers className={className} />;
    case "change":
      return <Zap className={className} />;
    case "surround":
      return <Terminal className={className} />;
    case "multicursor":
      return <GitBranch className={className} />;
    default:
      return null;
  }
}
