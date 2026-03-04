import { Position, SelectionState } from "@/types/challenge";

export type EditorMode = "normal" | "select" | "insert";

export interface EditorSelection {
  anchor: number;
  head: number;
}

interface HistoryEntry {
  content: string;
  selections: EditorSelection[];
}

type PendingCommand =
  | { type: "find"; till: boolean }
  | { type: "replace" }
  | { type: "goto" }
  | { type: "match-root" }
  | { type: "match"; action: "inside" | "around" | "surround" }
  | { type: "regex"; query: string };

export interface EngineState {
  content: string;
  mode: EditorMode;
  selections: EditorSelection[];
  register: string;
  pending: PendingCommand | null;
  status: string | null;
  history: HistoryEntry[];
  future: HistoryEntry[];
}

export interface EditorSnapshot {
  content: string;
  mode: EditorMode;
  selections: EditorSelection[];
  cursor: Position;
  selectionGoals: Array<{ start: Position; end: Position }>;
  pendingLabel: string | null;
  status: string | null;
}

export interface EditorKeyInput {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

const INDENT = "    ";
const WORD_CHAR = /[A-Za-z0-9_]/;

export function createEngineState(
  content: string,
  initialSelections?: SelectionState[],
): EngineState {
  const selections =
    initialSelections && initialSelections.length > 0
      ? initialSelections.map((selection) => ({
          anchor: positionToIndex(content, selection.anchor, false),
          head: positionToIndex(content, selection.head, false),
        }))
      : [{ anchor: 0, head: 0 }];

  return {
    content,
    mode: "normal",
    selections,
    register: "",
    pending: null,
    status: null,
    history: [],
    future: [],
  };
}

export function createSnapshot(state: EngineState): EditorSnapshot {
  const primary = state.selections[0] ?? { anchor: 0, head: 0 };
  const cursorIndex =
    state.mode === "insert"
      ? clampInsertIndex(primary.head, state.content.length)
      : clampCursorIndex(primary.head, state.content);

  return {
    content: state.content,
    mode: state.mode,
    selections: state.selections,
    cursor: indexToPosition(state.content, cursorIndex),
    selectionGoals: state.selections
      .map((selection) => selectionToGoal(state.content, selection))
      .filter((value): value is { start: Position; end: Position } => value !== null),
    pendingLabel: pendingLabel(state.pending),
    status: state.status,
  };
}

export function handleEditorKey(
  state: EngineState,
  input: EditorKeyInput,
): { state: EngineState; handled: boolean } {
  if (input.ctrlKey || input.metaKey || input.altKey) {
    return { state, handled: false };
  }

  if (input.key === "Escape") {
    return { state: handleEscape(state), handled: true };
  }

  if (state.pending) {
    return { state: handlePending(state, input.key), handled: true };
  }

  if (state.mode === "insert") {
    return { state: handleInsertMode(state, input.key), handled: true };
  }

  if (state.mode === "select") {
    const next = handleSelectMode(state, input.key);
    if (next) {
      return { state: next, handled: true };
    }
  }

  const next = handleNormalMode(state, input.key);
  if (next) {
    return { state: next, handled: true };
  }

  return { state, handled: false };
}

function handleEscape(state: EngineState): EngineState {
  if (state.pending) {
    return { ...state, pending: null, status: null };
  }

  if (state.mode === "insert") {
    return {
      ...state,
      mode: "normal",
      selections: state.selections.map((selection) => {
        const cursor = Math.max(0, selection.head - 1);
        return {
          anchor: clampCursorIndex(cursor, state.content),
          head: clampCursorIndex(cursor, state.content),
        };
      }),
      status: null,
    };
  }

  return {
    ...state,
    mode: "normal",
    selections: state.selections.map((selection) => ({
      anchor: selection.head,
      head: selection.head,
    })),
    status: null,
  };
}

function handlePending(state: EngineState, key: string): EngineState {
  if (state.pending?.type === "find") {
    if (key.length !== 1) {
      return { ...state, pending: null, status: "Find expects one character." };
    }
    return { ...applyFind(state, key, state.pending.till), pending: null, status: null };
  }

  if (state.pending?.type === "replace") {
    if (key.length !== 1) {
      return { ...state, pending: null, status: "Replace expects one character." };
    }
    return { ...replaceSelections(state, key), pending: null, status: null };
  }

  if (state.pending?.type === "goto") {
    return applyGoto(state, key);
  }

  if (state.pending?.type === "match-root") {
    if (key === "i") {
      return { ...state, pending: { type: "match", action: "inside" }, status: "Awaiting delimiter." };
    }
    if (key === "a") {
      return { ...state, pending: { type: "match", action: "around" }, status: "Awaiting delimiter." };
    }
    if (key === "s") {
      return { ...state, pending: { type: "match", action: "surround" }, status: "Awaiting delimiter." };
    }
    return { ...state, pending: null, status: "Use mi, ma, or ms." };
  }

  if (state.pending?.type === "match") {
    if (key.length !== 1) {
      return { ...state, pending: null, status: "Match expects one delimiter." };
    }
    return { ...applyMatch(state, state.pending.action, key), pending: null };
  }

  if (state.pending?.type === "regex") {
    if (key === "Backspace") {
      const query = state.pending.query.slice(0, -1);
      return {
        ...state,
        pending: { type: "regex", query },
        status: query || "Enter a regex and press Enter.",
      };
    }
    if (key === "Enter") {
      return applyRegexSelections(state, state.pending.query);
    }
    if (key.length === 1) {
      const query = state.pending.query + key;
      return { ...state, pending: { type: "regex", query }, status: query };
    }
  }

  return state;
}

function handleInsertMode(state: EngineState, key: string): EngineState {
  if (key === "Backspace") {
    return deleteBeforeInsertSelections(state);
  }
  if (key === "Enter") {
    return insertTextAtSelections(state, "\n");
  }
  if (key === "Tab") {
    return insertTextAtSelections(state, INDENT);
  }
  if (key.length === 1) {
    return insertTextAtSelections(state, key);
  }
  return state;
}

function handleSelectMode(state: EngineState, key: string): EngineState | null {
  if ("hjkl".includes(key)) {
    return moveSelections(state, key as "h" | "j" | "k" | "l", true);
  }
  if ("wbe".includes(key)) {
    return moveByWord(state, key as "w" | "b" | "e", true);
  }
  if (key === "f") {
    return { ...state, pending: { type: "find", till: false }, status: "Find next character." };
  }
  if (key === "t") {
    return { ...state, pending: { type: "find", till: true }, status: "Move before next character." };
  }
  return null;
}

function handleNormalMode(state: EngineState, key: string): EngineState | null {
  if ("hjkl".includes(key)) {
    return moveSelections(state, key as "h" | "j" | "k" | "l", false);
  }
  if ("wbe".includes(key)) {
    return moveByWord(state, key as "w" | "b" | "e", false);
  }

  switch (key) {
    case "f":
      return { ...state, pending: { type: "find", till: false }, status: "Find next character." };
    case "t":
      return { ...state, pending: { type: "find", till: true }, status: "Move before next character." };
    case "g":
      return { ...state, pending: { type: "goto" }, status: "Awaiting g, h, l, or e." };
    case "v":
      return { ...state, mode: "select", status: "Select mode." };
    case "x":
      return selectLines(state);
    case "X":
      return extendToLineBounds(state);
    case ";":
      return collapseSelections(state);
    case ",":
      return keepPrimarySelection(state);
    case "%":
      return selectEntireDocument(state);
    case "i":
      return enterInsertMode(state, "before");
    case "a":
      return enterInsertMode(state, "after");
    case "d":
      return deleteSelections(state);
    case "c":
      return changeSelections(state);
    case "r":
      return { ...state, pending: { type: "replace" }, status: "Replace with character." };
    case "y":
      return yankSelections(state);
    case "p":
      return pasteSelections(state, "after");
    case "P":
      return pasteSelections(state, "before");
    case "J":
      return joinSelectedLines(state);
    case ">":
      return indentSelections(state);
    case "<":
      return unindentSelections(state);
    case "~":
      return toggleCase(state);
    case "m":
      return { ...state, pending: { type: "match-root" }, status: "Use mi, ma, or ms." };
    case "C":
      return copySelectionsDown(state);
    case "s":
      return { ...state, pending: { type: "regex", query: "" }, status: "Enter a regex and press Enter." };
    case "u":
      return undo(state);
    case "U":
      return redo(state);
    default:
      return null;
  }
}

function moveSelections(
  state: EngineState,
  key: "h" | "j" | "k" | "l",
  extend: boolean,
): EngineState {
  return {
    ...state,
    selections: state.selections.map((selection) => {
      const next = moveCursor(state.content, clampCursorIndex(selection.head, state.content), key);
      return extend ? { ...selection, head: next } : { anchor: next, head: next };
    }),
    status: null,
  };
}

function moveByWord(
  state: EngineState,
  key: "w" | "b" | "e",
  extend: boolean,
): EngineState {
  return {
    ...state,
    selections: state.selections.map((selection) => {
      const current = clampCursorIndex(selection.head, state.content);
      const next =
        key === "w"
          ? nextWordStart(state.content, current)
          : key === "b"
            ? previousWordStart(state.content, current)
            : nextWordEnd(state.content, current);
      return extend ? { ...selection, head: next } : { anchor: next, head: next };
    }),
    status: null,
  };
}

function applyFind(state: EngineState, needle: string, till: boolean): EngineState {
  return {
    ...state,
    selections: state.selections.map((selection) => {
      const current = clampCursorIndex(selection.head, state.content);
      const found = state.content.indexOf(needle, current + 1);
      if (found === -1) {
        return selection;
      }
      const next = till ? Math.max(0, found - 1) : found;
      return state.mode === "select" ? { ...selection, head: next } : { anchor: next, head: next };
    }),
  };
}

function applyGoto(state: EngineState, key: string): EngineState {
  let target: number | null = null;
  const current = state.selections[0]?.head ?? 0;

  if (key === "g") {
    target = lineStartIndex(state.content, 0);
  } else if (key === "h") {
    target = lineStartIndex(state.content, indexToPosition(state.content, current).line);
  } else if (key === "l") {
    target = lineEndIndex(state.content, indexToPosition(state.content, current).line);
  } else if (key === "e") {
    target = lineEndIndex(state.content, state.content.split("\n").length - 1);
  }

  if (target === null) {
    return { ...state, pending: null, status: "Supported goto commands: gg, gh, gl, ge." };
  }

  return {
    ...state,
    pending: null,
    status: null,
    selections: state.selections.map(() => ({ anchor: target!, head: target! })),
  };
}

function enterInsertMode(state: EngineState, placement: "before" | "after"): EngineState {
  return {
    ...state,
    mode: "insert",
    selections: state.selections.map((selection) => {
      const range =
        placement === "before"
          ? selectionRange(selection, state.content)
          : actionRange(selection, state.content, state.mode);
      const point = placement === "before" ? range.start : range.end;
      return { anchor: point, head: point };
    }),
    status: "Insert mode.",
  };
}

function deleteSelections(state: EngineState): EngineState {
  const next = replaceSelectionRanges(state, () => "");
  return { ...state, ...next, status: null };
}

function changeSelections(state: EngineState): EngineState {
  const next = replaceSelectionRanges(state, () => "");
  return {
    ...state,
    ...next,
    mode: "insert",
    selections: next.selections.map((selection) => ({ anchor: selection.head, head: selection.head })),
    status: "Insert mode.",
  };
}

function replaceSelections(state: EngineState, char: string): EngineState {
  const next = replaceSelectionRanges(state, () => char);
  return {
    ...state,
    ...next,
    selections: next.selections.map((selection) => {
      const cursor = Math.max(0, selection.head - 1);
      return {
        anchor: clampCursorIndex(cursor, next.content),
        head: clampCursorIndex(cursor, next.content),
      };
    }),
  };
}

function yankSelections(state: EngineState): EngineState {
  return {
    ...state,
    register: state.selections
      .map((selection) => {
        const range = actionRange(selection, state.content, state.mode);
        return state.content.slice(range.start, range.end);
      })
      .join("\n"),
    status: "Selection yanked.",
  };
}

function pasteSelections(state: EngineState, placement: "before" | "after"): EngineState {
  if (!state.register) {
    return { ...state, status: "Register is empty." };
  }

  const points = state.selections.map((selection) => {
    const range =
      placement === "before"
        ? selectionRange(selection, state.content)
        : actionRange(selection, state.content, state.mode);
    return placement === "before" ? range.start : range.end;
  });
  const next = insertAtPositions(state, points, state.register);

  return {
    ...state,
    ...next,
    selections: next.selections.map((selection) => {
      const cursor = Math.max(0, selection.head - 1);
      return {
        anchor: clampCursorIndex(cursor, next.content),
        head: clampCursorIndex(cursor, next.content),
      };
    }),
    status: "Pasted register.",
  };
}

function joinSelectedLines(state: EngineState): EngineState {
  const lines = Array.from(
    new Set(
      state.selections.map((selection) => indexToPosition(state.content, selectionRange(selection, state.content).start).line),
    ),
  ).sort((left, right) => right - left);

  const next = pushHistory(state);
  let content = next.content;
  for (const line of lines) {
    const endExclusive = lineEndExclusive(content, line);
    if (content[endExclusive] !== "\n") {
      continue;
    }
    const nextStart = endExclusive + 1;
    const following = content.slice(nextStart).replace(/^\s+/, "");
    content = `${content.slice(0, endExclusive)} ${following}`;
  }

  return {
    ...next,
    content,
    selections: next.selections.map((selection) => {
      const cursor = clampCursorIndex(selection.head, content);
      return { anchor: cursor, head: cursor };
    }),
    status: null,
  };
}

function indentSelections(state: EngineState): EngineState {
  return transformSelectedLines(state, (line) => `${INDENT}${line}`);
}

function unindentSelections(state: EngineState): EngineState {
  return transformSelectedLines(state, (line) => line.replace(/^ {1,4}/, ""));
}

function toggleCase(state: EngineState): EngineState {
  return {
    ...state,
    ...replaceSelectionRanges(state, (value) =>
      value
        .split("")
        .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
        .join(""),
    ),
    status: null,
  };
}

function applyMatch(state: EngineState, action: "inside" | "around" | "surround", delimiter: string): EngineState {
  if (action === "surround") {
    const pair = surroundPair(delimiter);
    return {
      ...state,
      ...replaceSelectionRanges(state, (value) => `${pair.open}${value}${pair.close}`),
      status: "Surround applied.",
    };
  }

  const pair = surroundPair(delimiter);
  return {
    ...state,
    mode: "select",
    selections: state.selections.map((selection) => {
      const found = findEnclosingPair(state.content, clampCursorIndex(selection.head, state.content), pair.open, pair.close);
      if (!found) {
        return selection;
      }
      const start = action === "inside" ? found.open + 1 : found.open;
      const end = action === "inside" ? found.close - 1 : found.close;
      return { anchor: clampCursorIndex(start, state.content), head: clampCursorIndex(end, state.content) };
    }),
    status: action === "inside" ? "Selected inside delimiter." : "Selected around delimiter.",
  };
}

function copySelectionsDown(state: EngineState): EngineState {
  const lines = state.content.split("\n");
  const additions: EditorSelection[] = [];
  const existing = new Set(state.selections.map((selection) => `${selection.anchor}:${selection.head}`));
  for (const selection of state.selections) {
    const range = selectionRange(selection, state.content);
    const start = indexToPosition(state.content, range.start);
    const end = indexToPosition(state.content, range.end);
    const nextLine = start.line + 1;
    if (nextLine >= lines.length) {
      continue;
    }

    const anchor = positionToIndex(
      state.content,
      { line: nextLine, column: Math.min(start.column, maxCursorColumn(lines[nextLine] ?? "")) },
      false,
    );
    const head =
      selection.anchor === selection.head
        ? anchor
        : positionToIndex(
            state.content,
            {
              line: nextLine,
              column: Math.max(0, Math.min(end.column - 1, maxCursorColumn(lines[nextLine] ?? ""))),
            },
            false,
          );
    const key = `${anchor}:${head}`;
    if (existing.has(key)) {
      continue;
    }

    existing.add(key);
    additions.push({ anchor, head });
  }

  if (additions.length === 0) {
    return { ...state, status: "No lower line available for C." };
  }

  return {
    ...state,
    selections: [...state.selections, ...additions],
    status: `${additions.length} extra selection${additions.length === 1 ? "" : "s"} added.`,
  };
}

function applyRegexSelections(state: EngineState, query: string): EngineState {
  if (!query) {
    return { ...state, pending: null, status: "Regex cannot be empty." };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(query, "g");
  } catch {
    return { ...state, pending: null, status: "Invalid regex." };
  }

  const selections: EditorSelection[] = [];
  for (const selection of state.selections) {
    const range = selectionRange(selection, state.content);
    const haystack = state.content.slice(range.start, range.end);
    const offset = range.start;
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(haystack)) !== null) {
      if (!match[0]) {
        break;
      }
      const start = offset + match.index;
      selections.push({ anchor: start, head: start + match[0].length - 1 });
    }
  }

  if (selections.length === 0) {
    return { ...state, pending: null, status: "Regex matched nothing." };
  }

  return {
    ...state,
    mode: "select",
    selections,
    pending: null,
    status: `${selections.length} match${selections.length === 1 ? "" : "es"} selected.`,
  };
}

function undo(state: EngineState): EngineState {
  const previous = state.history[state.history.length - 1];
  if (!previous) {
    return { ...state, status: "Nothing to undo." };
  }

  return {
    ...state,
    content: previous.content,
    selections: previous.selections,
    history: state.history.slice(0, -1),
    future: [{ content: state.content, selections: state.selections }, ...state.future],
    mode: "normal",
    pending: null,
    status: "Undo.",
  };
}

function redo(state: EngineState): EngineState {
  const next = state.future[0];
  if (!next) {
    return { ...state, status: "Nothing to redo." };
  }

  return {
    ...state,
    content: next.content,
    selections: next.selections,
    history: [...state.history, { content: state.content, selections: state.selections }],
    future: state.future.slice(1),
    mode: "normal",
    pending: null,
    status: "Redo.",
  };
}

function collapseSelections(state: EngineState): EngineState {
  return {
    ...state,
    mode: "normal",
    selections: state.selections.map((selection) => ({ anchor: selection.head, head: selection.head })),
    status: null,
  };
}

function keepPrimarySelection(state: EngineState): EngineState {
  return { ...state, selections: state.selections.slice(0, 1), status: "Kept primary selection." };
}

function selectEntireDocument(state: EngineState): EngineState {
  if (!state.content) {
    return state;
  }
  return {
    ...state,
    mode: "select",
    selections: [{ anchor: 0, head: Math.max(0, state.content.length - 1) }],
    status: "Entire document selected.",
  };
}

function selectLines(state: EngineState): EngineState {
  return {
    ...state,
    mode: "select",
    selections: state.selections.map((selection) => {
      const range = selectionRange(selection, state.content);
      const startLine = indexToPosition(state.content, range.start).line;
      const endLine = indexToPosition(state.content, Math.max(range.start, range.end - 1)).line;
      const fullStart = lineStartIndex(state.content, startLine);
      const fullEnd = lineSelectionEnd(state.content, endLine);
      const isFull = range.start === fullStart && range.end === fullEnd;
      const targetLine = isFull ? endLine + 1 : endLine;
      return {
        anchor: lineStartIndex(state.content, startLine),
        head: lineSelectionHeadIndex(state.content, targetLine),
      };
    }),
    status: "Line selected.",
  };
}

function extendToLineBounds(state: EngineState): EngineState {
  return {
    ...state,
    mode: "select",
    selections: state.selections.map((selection) => {
      const range = selectionRange(selection, state.content);
      const startLine = indexToPosition(state.content, range.start).line;
      const endLine = indexToPosition(state.content, Math.max(range.start, range.end - 1)).line;
      return { anchor: lineStartIndex(state.content, startLine), head: lineEndIndex(state.content, endLine) };
    }),
    status: "Selection extended to line bounds.",
  };
}

function insertTextAtSelections(state: EngineState, text: string): EngineState {
  const points = state.selections.map((selection) => clampInsertIndex(selection.head, state.content.length));
  const next = insertAtPositions(state, points, text);
  return {
    ...state,
    ...next,
    mode: "insert",
    selections: next.selections.map((selection) => ({ anchor: selection.head, head: selection.head })),
    status: null,
  };
}

function deleteBeforeInsertSelections(state: EngineState): EngineState {
  const next = pushHistory(state);
  let content = next.content;
  const selections = [...next.selections];
  next.selections
    .map((selection, index) => ({ index, head: clampInsertIndex(selection.head, next.content.length) }))
    .filter((selection) => selection.head > 0)
    .sort((left, right) => right.head - left.head)
    .forEach(({ index, head }) => {
      content = `${content.slice(0, head - 1)}${content.slice(head)}`;
      selections[index] = { anchor: head - 1, head: head - 1 };
    });

  return { ...next, content, selections };
}

function transformSelectedLines(state: EngineState, transform: (line: string) => string): EngineState {
  const next = pushHistory(state);
  const lines = next.content.split("\n");
  const selectedLines = new Set<number>();
  for (const selection of next.selections) {
    const range = selectionRange(selection, next.content);
    const startLine = indexToPosition(next.content, range.start).line;
    const endLine = indexToPosition(next.content, Math.max(range.start, range.end - 1)).line;
    for (let line = startLine; line <= endLine; line += 1) {
      selectedLines.add(line);
    }
  }

  for (const line of selectedLines) {
    lines[line] = transform(lines[line]);
  }

  const content = lines.join("\n");
  return {
    ...next,
    content,
    selections: next.selections.map((selection) => {
      const cursor = clampCursorIndex(selection.head, content);
      return { anchor: cursor, head: cursor };
    }),
    status: null,
  };
}

function replaceSelectionRanges(
  state: EngineState,
  replacement: (value: string) => string,
): Pick<EngineState, "content" | "selections" | "history" | "future"> {
  const next = pushHistory(state);
  let content = next.content;
  const selections = [...next.selections];

  next.selections
    .map((selection, index) => ({ index, ...actionRange(selection, next.content, next.mode) }))
    .sort((left, right) => right.start - left.start)
    .forEach(({ index, start, end }) => {
      const value = content.slice(start, end);
      const nextValue = replacement(value);
      content = `${content.slice(0, start)}${nextValue}${content.slice(end)}`;
      const head = nextValue ? start + nextValue.length - 1 : Math.max(0, start - 1);
      selections[index] = {
        anchor: clampCursorIndex(head, content),
        head: clampCursorIndex(head, content),
      };
    });

  return { content, selections, history: next.history, future: [] };
}

function insertAtPositions(
  state: EngineState,
  positions: number[],
  text: string,
): Pick<EngineState, "content" | "selections" | "history" | "future"> {
  const next = pushHistory(state);
  let content = next.content;
  const selections = [...next.selections];

  positions
    .map((position, index) => ({ index, position }))
    .sort((left, right) => right.position - left.position)
    .forEach(({ index, position }) => {
      content = `${content.slice(0, position)}${text}${content.slice(position)}`;
      const head = position + text.length;
      selections[index] = { anchor: head, head };
    });

  return { content, selections, history: next.history, future: [] };
}

function actionRange(selection: EditorSelection, content: string, mode: EditorMode) {
  if (selection.anchor !== selection.head) {
    return selectionRange(selection, content);
  }
  if (mode === "insert") {
    return { start: selection.head, end: selection.head };
  }
  const start = clampCursorIndex(selection.head, content);
  return { start, end: Math.min(content.length, start + 1) };
}

function selectionRange(selection: EditorSelection, content: string) {
  if (selection.anchor === selection.head) {
    const point = clampInsertIndex(selection.head, content.length);
    return { start: point, end: point };
  }
  return {
    start: Math.min(selection.anchor, selection.head),
    end: Math.min(content.length, Math.max(selection.anchor, selection.head) + 1),
  };
}

function selectionToGoal(content: string, selection: EditorSelection) {
  if (selection.anchor === selection.head) {
    return null;
  }
  const range = selectionRange(selection, content);
  return { start: indexToPosition(content, range.start), end: indexToPosition(content, range.end) };
}

function pendingLabel(pending: PendingCommand | null): string | null {
  if (!pending) {
    return null;
  }
  if (pending.type === "match") {
    return pending.action === "inside" ? "mi" : pending.action === "around" ? "ma" : "ms";
  }
  if (pending.type === "regex") {
    return `s ${pending.query}`;
  }
  return pending.type === "find"
    ? pending.till
      ? "t"
      : "f"
    : pending.type === "goto"
      ? "g"
      : pending.type === "replace"
        ? "r"
      : "m";
}

function moveCursor(content: string, index: number, direction: "h" | "j" | "k" | "l") {
  const position = indexToPosition(content, index);
  const lines = content.split("\n");
  if (direction === "h") {
    return lineColumnToCursorIndex(content, position.line, Math.max(0, position.column - 1));
  }
  if (direction === "l") {
    return lineColumnToCursorIndex(
      content,
      position.line,
      Math.min(position.column + 1, maxCursorColumn(lines[position.line] ?? "")),
    );
  }
  if (direction === "j") {
    const nextLine = Math.min(lines.length - 1, position.line + 1);
    return lineColumnToCursorIndex(
      content,
      nextLine,
      Math.min(position.column, maxCursorColumn(lines[nextLine] ?? "")),
    );
  }
  const previousLine = Math.max(0, position.line - 1);
  return lineColumnToCursorIndex(
    content,
    previousLine,
    Math.min(position.column, maxCursorColumn(lines[previousLine] ?? "")),
  );
}

function nextWordStart(content: string, index: number) {
  let cursor = Math.min(content.length, index + 1);
  while (cursor < content.length && WORD_CHAR.test(content[cursor] ?? "")) {
    cursor += 1;
  }
  while (cursor < content.length && !WORD_CHAR.test(content[cursor] ?? "")) {
    cursor += 1;
  }
  return clampCursorIndex(cursor, content);
}

function previousWordStart(content: string, index: number) {
  let cursor = Math.max(0, index - 1);
  while (cursor > 0 && !WORD_CHAR.test(content[cursor] ?? "")) {
    cursor -= 1;
  }
  while (cursor > 0 && WORD_CHAR.test(content[cursor - 1] ?? "")) {
    cursor -= 1;
  }
  return clampCursorIndex(cursor, content);
}

function nextWordEnd(content: string, index: number) {
  let cursor = Math.min(Math.max(0, content.length - 1), index + 1);
  while (cursor < content.length && !WORD_CHAR.test(content[cursor] ?? "")) {
    cursor += 1;
  }
  while (cursor < content.length - 1 && WORD_CHAR.test(content[cursor + 1] ?? "")) {
    cursor += 1;
  }
  return clampCursorIndex(cursor, content);
}

function surroundPair(delimiter: string) {
  if (delimiter === "(" || delimiter === ")") {
    return { open: "(", close: ")" };
  }
  if (delimiter === "[" || delimiter === "]") {
    return { open: "[", close: "]" };
  }
  if (delimiter === "{" || delimiter === "}") {
    return { open: "{", close: "}" };
  }
  return { open: delimiter, close: delimiter };
}

function findEnclosingPair(content: string, cursor: number, open: string, close: string) {
  if (open === close) {
    const left = content.lastIndexOf(open, cursor);
    const right = content.indexOf(close, cursor + 1);
    return left >= 0 && right > left ? { open: left, close: right } : null;
  }

  let depth = 0;
  let left = -1;
  for (let index = cursor; index >= 0; index -= 1) {
    if (content[index] === close) {
      depth += 1;
    } else if (content[index] === open) {
      if (depth === 0) {
        left = index;
        break;
      }
      depth -= 1;
    }
  }
  if (left === -1) {
    return null;
  }

  depth = 0;
  for (let index = left; index < content.length; index += 1) {
    if (content[index] === open) {
      depth += 1;
    } else if (content[index] === close) {
      depth -= 1;
      if (depth === 0) {
        return { open: left, close: index };
      }
    }
  }

  return null;
}

function pushHistory(state: EngineState): EngineState {
  return {
    ...state,
    history: [...state.history, { content: state.content, selections: state.selections }],
    future: [],
  };
}

function clampCursorIndex(index: number, content: string) {
  if (!content) {
    return 0;
  }
  return Math.max(0, Math.min(content.length - 1, index));
}

function clampInsertIndex(index: number, length: number) {
  return Math.max(0, Math.min(length, index));
}

function getLineStarts(content: string) {
  const starts = [0];
  for (let index = 0; index < content.length; index += 1) {
    if (content[index] === "\n") {
      starts.push(index + 1);
    }
  }
  return starts;
}

export function indexToPosition(content: string, index: number): Position {
  const clamped = clampInsertIndex(index, content.length);
  const starts = getLineStarts(content);
  let line = 0;
  for (let current = 0; current < starts.length; current += 1) {
    if (starts[current] > clamped) {
      break;
    }
    line = current;
  }
  return { line, column: clamped - starts[line] };
}

export function positionToIndex(content: string, position: Position, allowLineEnd: boolean): number {
  const lines = content.split("\n");
  const line = Math.max(0, Math.min(lines.length - 1, position.line));
  const maxColumn = allowLineEnd ? lines[line]?.length ?? 0 : maxCursorColumn(lines[line] ?? "");
  const column = Math.max(0, Math.min(maxColumn, position.column));
  return lineStartIndex(content, line) + column;
}

function lineStartIndex(content: string, line: number) {
  const starts = getLineStarts(content);
  return starts[Math.max(0, Math.min(starts.length - 1, line))] ?? 0;
}

function lineEndExclusive(content: string, line: number) {
  const starts = getLineStarts(content);
  const nextStart = starts[line + 1];
  return nextStart === undefined ? content.length : nextStart - 1;
}

function lineEndIndex(content: string, line: number) {
  const start = lineStartIndex(content, line);
  const exclusive = lineEndExclusive(content, line);
  return exclusive === start ? start : Math.max(start, exclusive - 1);
}

function lineSelectionHeadIndex(content: string, line: number) {
  const exclusive = lineSelectionEnd(content, line);
  return exclusive === 0 ? 0 : Math.max(0, exclusive - 1);
}

function lineSelectionEnd(content: string, line: number) {
  const exclusive = lineEndExclusive(content, line);
  const isLastLine = line >= content.split("\n").length - 1;
  return isLastLine ? exclusive : Math.min(content.length, exclusive + 1);
}

function lineColumnToCursorIndex(content: string, line: number, column: number) {
  return positionToIndex(content, { line, column }, false);
}

function maxCursorColumn(line: string) {
  return line.length === 0 ? 0 : line.length - 1;
}
