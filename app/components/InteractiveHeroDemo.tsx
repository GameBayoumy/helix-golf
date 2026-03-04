"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveHeroDemo() {
  const [mode, setMode] = useState("normal");
  const [input, setInput] = useState("");
  const [selection, setSelection] = useState({ text: "name", active: true });
  const [showSuccess, setShowSuccess] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCursorVisible((value) => !value);
    }, 530);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (showSuccess) {
      setShowSuccess(false);
      setSelection({ text: "name", active: true });
      setInput("");
      setMode("normal");
      return;
    }

    const key = event.key;

    if (key === "Backspace") {
      setInput((value) => value.slice(0, -1));
      return;
    }

    if (key === "Escape") {
      setInput("");
      setMode("normal");
      setSelection({ text: "name", active: true });
      return;
    }

    if (key.length !== 1) {
      return;
    }

    const nextInput = input + key;
    setInput(nextInput);

    if (nextInput === 'ms"') {
      window.setTimeout(() => {
        setSelection({ text: '"name"', active: false });
        setShowSuccess(true);
        setMode("normal");
      }, 200);
      return;
    }

    if (nextInput === "m") {
      setMode("match");
      return;
    }

    if (nextInput === "ms") {
      setMode("surround");
    }
  };

  const modeInfo =
    mode === "match"
      ? { text: "MATCH", color: "var(--color-mustard)" }
      : mode === "surround"
        ? { text: "SURROUND", color: "var(--color-terracotta)" }
        : { text: "NORMAL", color: "var(--color-sage)" };

  return (
    <div className="relative ml-auto max-w-lg cursor-text terminal-warm" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header-warm">
        <div className="flex gap-2">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
        </div>
        <span className="ml-4 text-sm text-subtle">challenge_01.rs - Click to type</span>
      </div>

      <div className="relative p-6 font-mono text-sm text-[var(--editor-text)]">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 h-full w-full cursor-text opacity-0"
          autoFocus
        />

        <div className="mb-4 flex items-center gap-3 text-subtle">
          <span style={{ color: modeInfo.color }}>{modeInfo.text}</span>
          {input && <span className="text-[var(--editor-text)]">{input}</span>}
          <span
            className="inline-block h-4 w-2 bg-editor-text"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          />
          {mode === "surround" && <span className="text-xs opacity-60">- press &quot; to wrap</span>}
        </div>

        <div className="space-y-1">
          <div className="flex">
            <span className="w-6 text-[var(--editor-gutter)]">1</span>
            <span className="text-subtle">fn </span>
            <span className="text-[var(--color-mustard)]">greet</span>
            <span className="text-[var(--editor-text)]">(</span>
            {selection.active ? (
              <span className="rounded px-1" style={{ backgroundColor: "var(--editor-selection)" }}>
                {selection.text}
              </span>
            ) : (
              <span className="text-[var(--color-sage)]">{selection.text}</span>
            )}
            <span className="text-[var(--editor-text)]">) {"{}"}</span>
          </div>

          <div className="flex opacity-40">
          <span className="w-6 text-[var(--editor-gutter)]">2</span>
          <span>
              {showSuccess ? "// Perfect! ms&quot; wraps selection in quotes" : "// Type ms&quot; to wrap selection"}
          </span>
        </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--editor-border)] pt-4 text-xs">
          <div className="flex items-center gap-4">
            <span className={selection.active ? "text-[var(--color-sage)]" : "text-[var(--color-mustard)]"}>
              {selection.active ? "* 1 selection" : "changed"}
            </span>
            <span className="text-subtle">{selection.text.length} chars</span>
          </div>
          {showSuccess && <span className="text-[var(--color-sage)]">Press any key to reset</span>}
        </div>
      </div>

      <div
        className="absolute -bottom-4 -left-4 rounded-lg border border-[var(--border-subtle)] bg-white p-4 shadow-xl transition-all duration-300"
        style={{
          transform: showSuccess ? "rotate(0deg) scale(1.05)" : "rotate(-2deg)",
          borderColor: showSuccess ? "var(--color-sage)" : "var(--border-subtle)",
        }}
      >
        <p className="mb-2 text-xs text-muted">
          {showSuccess ? "Wrapped successfully." : "Try: wrap with quotes"}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="key-physical transition-all"
            style={{
              background: showSuccess ? "var(--color-sage)" : undefined,
              color: showSuccess ? "white" : undefined,
              borderColor: showSuccess ? "var(--color-sage)" : undefined,
            }}
          >
            {'ms"'}
          </span>
          <span className="text-muted">-&gt;</span>
          <span className="font-mono text-[var(--color-sage)]">
            {showSuccess ? '"name"' : '"name"'}
          </span>
        </div>
      </div>
    </div>
  );
}
