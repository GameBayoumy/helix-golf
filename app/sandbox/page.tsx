"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Code2,
  Eraser,
  RotateCcw,
  Terminal,
} from "lucide-react";

import HelixEditor from "@/components/HelixEditor";
import { quickReference } from "@/lib/command-catalog";
import { EditorSnapshot } from "@/lib/helix-engine";

const initialContent = `// Helix Dojo sandbox
// Practice the supported Helix subset here.
//
// Useful commands:
//   hjkl      move
//   w b e     word motions
//   gg gh gl ge
//   x X v ; %
//   d c r y p P
//   mi( ma[ ms"
//   C and s

function greet(name) {
    return "Hello, " + name;
}

const result = greet("World");`;

const emptySnapshot: EditorSnapshot = {
  content: initialContent,
  mode: "normal",
  selections: [],
  cursor: { line: 0, column: 0 },
  selectionGoals: [],
  pendingLabel: null,
  status: null,
};

export default function SandboxPage() {
  const [content, setContent] = useState(initialContent);
  const [keystrokes, setKeystrokes] = useState(0);
  const [snapshot, setSnapshot] = useState<EditorSnapshot>(emptySnapshot);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setContent(initialContent);
    setSnapshot({ ...emptySnapshot, content: initialContent });
    setKeystrokes(0);
    setResetKey((value) => value + 1);
  };

  const handleClear = () => {
    setContent("");
    setSnapshot({ ...emptySnapshot, content: "" });
    setKeystrokes(0);
    setResetKey((value) => value + 1);
  };

  return (
    <div className="app-frame">
      <header className="border-b border-subtle bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted transition-colors hover:text-[var(--text-default)]"
            >
              <ChevronLeft size={18} />
              <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                Back
              </span>
            </Link>

            <div className="h-6 w-px bg-border-subtle" />

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-surface-strong p-2">
                <Terminal className="text-[var(--color-sage)]" size={18} />
              </div>
              <div>
                <h1 className="font-semibold text-[var(--text-default)]">Sandbox</h1>
                <p className="text-sm text-muted">Single-engine Helix practice space</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 rounded-lg border border-subtle px-3 py-2 text-sm text-muted transition-colors hover:border-[var(--text-default)]"
              type="button"
            >
              <Eraser size={14} />
              Clear
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-subtle px-3 py-2 text-sm text-muted transition-colors hover:border-[var(--text-default)]"
              type="button"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="panel-card overflow-hidden">
              <div className="panel-muted flex items-center justify-between px-4 py-2">
                <span className="text-sm text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                  sandbox.txt
                </span>
                <div className="flex items-center gap-4 text-xs text-subtle">
                  <span className="flex items-center gap-1">
                    <Code2 size={12} />
                    {content.length} chars
                  </span>
                  <span>{content.split("\n").length} lines</span>
                </div>
              </div>

              <div className="h-[600px]">
                <HelixEditor
                  initialContent={content}
                  onContentChange={setContent}
                  onKeystroke={() => setKeystrokes((value) => value + 1)}
                  onStateChange={setSnapshot}
                  resetKey={`sandbox-${resetKey}`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel-card p-4">
              <h3 className="mb-4 font-semibold text-[var(--text-default)]">Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Keystrokes</span>
                  <span className="font-mono font-semibold">{keystrokes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Cursor</span>
                  <span className="font-mono">
                    {snapshot.cursor.line + 1}:{snapshot.cursor.column + 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Selections</span>
                  <span className="font-mono">{snapshot.selectionGoals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Mode</span>
                  <span className="font-mono uppercase">{snapshot.mode}</span>
                </div>
              </div>
            </div>

            <div className="panel-card p-4">
              <h3 className="mb-4 font-semibold text-[var(--text-default)]">Quick Reference</h3>
              <div className="space-y-2">
                {quickReference.map((item) => (
                  <div key={item.keys} className="flex items-center justify-between gap-3 text-sm">
                    <code className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-xs text-[var(--color-terracotta)]">
                      {item.keys}
                    </code>
                    <span className="text-right text-xs text-muted">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
