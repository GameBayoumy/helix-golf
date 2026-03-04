"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  X,
} from "lucide-react";

import SupportedCommandGuide from "@/components/SupportedCommandGuide";
import {
  createEngineState,
  createSnapshot,
  EditorSelection,
  handleEditorKey,
} from "@/lib/helix-engine";
import { SelectionState } from "@/types/challenge";

interface HelixEditorProps {
  initialContent: string;
  initialSelections?: SelectionState[];
  onContentChange: (content: string) => void;
  onKeystroke: (key: string) => void;
  onStateChange: (snapshot: ReturnType<typeof createSnapshot>) => void;
  readOnly?: boolean;
  resetKey?: string;
}

export default function HelixEditor({
  initialContent,
  initialSelections,
  onContentChange,
  onKeystroke,
  onStateChange,
  readOnly = false,
  resetKey,
}: HelixEditorProps) {
  const [showKeyGuide, setShowKeyGuide] = useState(false);
  const sessionKey = useMemo(
    () =>
      JSON.stringify({
        initialContent,
        initialSelections: initialSelections ?? [],
        resetKey: resetKey ?? null,
      }),
    [initialContent, initialSelections, resetKey],
  );

  return (
    <HelixEditorSession
      key={sessionKey}
      initialContent={initialContent}
      initialSelections={initialSelections}
      onContentChange={onContentChange}
      onKeystroke={onKeystroke}
      onStateChange={onStateChange}
      readOnly={readOnly}
      showKeyGuide={showKeyGuide}
      setShowKeyGuide={setShowKeyGuide}
    />
  );
}

interface HelixEditorSessionProps extends Omit<HelixEditorProps, "resetKey"> {
  showKeyGuide: boolean;
  setShowKeyGuide: Dispatch<SetStateAction<boolean>>;
}

function HelixEditorSession({
  initialContent,
  initialSelections,
  onContentChange,
  onKeystroke,
  onStateChange,
  readOnly = false,
  showKeyGuide,
  setShowKeyGuide,
}: HelixEditorSessionProps) {
  const [state, setState] = useState(() => createEngineState(initialContent, initialSelections));
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  useEffect(() => {
    onContentChange(state.content);
    onStateChange(createSnapshot(state));
  }, [state, onContentChange, onStateChange]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) {
      return;
    }

    const result = handleEditorKey(state, {
      key: event.key,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
    });

    if (!result.handled) {
      return;
    }

    event.preventDefault();
    onKeystroke(event.key);
    setState(result.state);
  };

  const snapshot = createSnapshot(state);
  const lines = state.content.split("\n");

  return (
    <div className="editor-shell flex h-full flex-col">
      <div className="editor-panel flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded text-xs font-bold ${modeColor(state.mode)}`}>
            {state.mode.toUpperCase()}
          </div>
          {snapshot.pendingLabel && (
            <span className="font-mono text-xs text-[var(--editor-pending)]">{snapshot.pendingLabel}</span>
          )}
          {snapshot.status && (
            <span className="text-xs text-[var(--editor-muted)]">{snapshot.status}</span>
          )}
        </div>

        <button
          onClick={() => setShowKeyGuide((value) => !value)}
          className={`p-2 rounded transition-colors ${
            showKeyGuide
              ? "bg-editor-border text-[var(--editor-text)]"
              : "text-[var(--editor-muted)] hover:text-[var(--editor-text)]"
          }`}
          type="button"
        >
          <Keyboard size={16} />
        </button>
      </div>

      <div className="flex-1 relative">
        <div
          ref={rootRef}
          className="h-full overflow-auto p-4 font-mono text-sm leading-6 outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => rootRef.current?.focus()}
          role="textbox"
          aria-label="Helix practice editor"
        >
          {lines.map((line, lineIndex) => (
            <div key={`${lineIndex}-${line}`} className="flex min-h-6">
              <span className="w-8 select-none pr-3 text-right text-[var(--editor-gutter)]">{lineIndex + 1}</span>
              <span className="flex-1 whitespace-pre">
                {renderLine(line, lineIndex, lines, state.selections, state.mode)}
              </span>
            </div>
          ))}
        </div>

        {showKeyGuide && (
          <div
            className="editor-panel absolute right-4 top-4 z-10 w-80 rounded-lg border p-4 shadow-2xl"
            style={{ backgroundColor: "rgba(26, 26, 37, 0.98)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[var(--editor-text)]">Supported Helix Subset</span>
              <button
                onClick={() => setShowKeyGuide(false)}
                className="text-[var(--editor-muted)] hover:text-[var(--editor-text)]"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              <SupportedCommandGuide compact dark />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderLine(
  line: string,
  lineIndex: number,
  lines: string[],
  selections: EditorSelection[],
  mode: "normal" | "select" | "insert",
) {
  const absoluteStart = lines
    .slice(0, lineIndex)
    .reduce((sum, current) => sum + current.length + 1, 0);
  const expandedRanges = selections
    .filter((selection) => selection.anchor !== selection.head)
    .map((selection) => {
      const start = Math.min(selection.anchor, selection.head);
      const end = Math.max(selection.anchor, selection.head) + 1;
      return { start, end };
    });
  const collapsed = selections.filter((selection) => selection.anchor === selection.head);
  const output: React.ReactNode[] = [];

  if (!line.length) {
    const emptyIndex = absoluteStart;
    const hasInsertCaret = mode === "insert" && collapsed.some((selection) => selection.head === emptyIndex);
    const hasCursor = mode !== "insert" && collapsed.some((selection) => selection.head === emptyIndex);
    output.push(
      <span
        key={`empty-${lineIndex}`}
        className={`inline-block min-w-3 ${hasCursor ? "rounded bg-editor-cursor text-white" : "text-[var(--editor-muted)]"}`}
      >
        {hasInsertCaret ? <span className="inline-block h-5 w-[2px] bg-editor-text align-middle" /> : " "}
      </span>,
    );
    return output;
  }

  for (let column = 0; column < line.length; column += 1) {
    const absoluteIndex = absoluteStart + column;
    if (mode === "insert" && collapsed.some((selection) => selection.head === absoluteIndex)) {
      output.push(<span key={`caret-${absoluteIndex}`} className="inline-block h-5 w-[2px] bg-editor-text align-middle" />);
    }

    const selected = expandedRanges.some(
      (range) => absoluteIndex >= range.start && absoluteIndex < range.end,
    );
    const cursor = mode !== "insert" && collapsed.some((selection) => selection.head === absoluteIndex);

    output.push(
      <span
        key={`char-${absoluteIndex}`}
        className={[
          "rounded-sm",
          selected ? "text-[var(--editor-text)]" : "",
          cursor ? "bg-editor-cursor text-white" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={selected ? { backgroundColor: "var(--editor-selection)" } : undefined}
      >
        {line[column]}
      </span>,
    );
  }

  const lineEnd = absoluteStart + line.length;
  if (mode === "insert" && collapsed.some((selection) => selection.head === lineEnd)) {
    output.push(<span key={`caret-end-${lineIndex}`} className="inline-block h-5 w-[2px] bg-editor-text align-middle" />);
  }

  return output;
}

function modeColor(mode: "normal" | "select" | "insert") {
  switch (mode) {
    case "normal":
      return "bg-color-sage text-white";
    case "select":
      return "bg-color-select text-white";
    case "insert":
      return "bg-color-terracotta text-white";
    default:
      return "bg-editor-muted text-white";
  }
}
