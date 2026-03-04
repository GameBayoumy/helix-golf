import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Keyboard,
  Layers,
  Lightbulb,
} from "lucide-react";

import SupportedCommandGuide from "@/components/SupportedCommandGuide";

const tips = [
  {
    iconId: "check",
    color: "var(--color-sage)",
    title: "Watch the mode badge",
    description: "Normal, select, and insert are distinct states. The trainer validates them directly.",
  },
  {
    iconId: "lightbulb",
    color: "var(--color-mustard)",
    title: "Practice exact goals",
    description: "Movement drills check cursor position. Selection drills check the real selected range.",
  },
  {
    iconId: "keyboard",
    color: "var(--color-terracotta)",
    title: "Use the Goal panel",
    description: "If a challenge is about state instead of final text, reveal the goal instead of guessing.",
  },
  {
    iconId: "layers",
    color: "var(--color-cyan)",
    title: "Multi-select carefully",
    description: "Extra cursors help, but each selection still needs to land on the correct text.",
  },
];

export default function TutorialPage() {
  return (
    <div className="app-frame">
      <header className="border-b border-subtle bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-muted transition-colors hover:text-[var(--text-default)]"
          >
            <ChevronLeft size={18} />
            <span style={{ fontFamily: "var(--font-mono)" }}>Back</span>
          </Link>

          <h1 className="mb-4 text-4xl font-bold text-[var(--text-default)]" style={{ fontFamily: "var(--font-serif)" }}>
            Helix Tutorial
          </h1>

          <p className="max-w-2xl text-lg text-muted" style={{ fontFamily: "var(--font-sans)" }}>
            This app intentionally teaches a verified Helix subset with one editor engine and real state validation.
          </p>
        </div>
      </header>

      <section className="bg-surface-subtle py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="panel-card flex items-start gap-4 p-6">
            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-mustard) 12%, transparent)" }}
            >
              <Lightbulb className="text-[var(--color-mustard)]" size={24} />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold text-[var(--text-default)]" style={{ fontFamily: "var(--font-mono)" }}>
                Current Scope
              </h2>
              <p className="text-muted">
                The trainer focuses on movement, explicit selections, edits, surrounds, regex selection, and
                multi-cursor flows. The goal is to teach the supported surface correctly before broadening it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-2xl font-bold text-[var(--text-default)]" style={{ fontFamily: "var(--font-serif)" }}>
            Supported Commands
          </h2>

          <div className="panel-card p-6">
            <SupportedCommandGuide />
          </div>
        </div>
      </section>

      <section className="bg-surface-subtle py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-2xl font-bold text-[var(--text-default)]" style={{ fontFamily: "var(--font-serif)" }}>
            Practice Tips
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {tips.map((tip) => {
              return (
                <div key={tip.title} className="panel-card flex items-start gap-4 p-4">
                  <div
                    className="flex-shrink-0 rounded-lg p-2"
                    style={{ backgroundColor: `color-mix(in srgb, ${tip.color} 12%, transparent)` }}
                  >
                    {renderTipIcon(tip.iconId, tip.color)}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-[var(--text-default)]">{tip.title}</h3>
                    <p className="text-sm text-muted">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-[var(--text-default)]" style={{ fontFamily: "var(--font-serif)" }}>
            Ready to practice?
          </h2>

          <p className="mb-8 text-muted">Start with movement, then work into selection-driven edits.</p>

          <Link
            href="/challenge/basic-hjkl"
            className="inline-flex items-center gap-2 rounded-lg bg-surface-strong px-8 py-4 font-semibold text-white transition-colors hover:opacity-90"
          >
            Start First Challenge
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function renderTipIcon(iconId: (typeof tips)[number]["iconId"], color: string) {
  const style = { color };

  switch (iconId) {
    case "check":
      return <CheckCircle2 size={20} style={style} />;
    case "lightbulb":
      return <Lightbulb size={20} style={style} />;
    case "keyboard":
      return <Keyboard size={20} style={style} />;
    case "layers":
      return <Layers size={20} style={style} />;
    default:
      return null;
  }
}
