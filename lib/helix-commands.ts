import { HelixMode, Keystroke } from '@/types/challenge';

export interface HelixCommand {
  key: string;
  name: string;
  description: string;
  mode: HelixMode['type'];
  action: (editor: EditorState) => EditorState;
}

export interface EditorState {
  content: string;
  cursorPosition: { line: number; column: number };
  selections: Selection[];
  mode: HelixMode;
  registers: Record<string, string>;
}

export interface Selection {
  start: { line: number; column: number };
  end: { line: number; column: number };
  cursor: 'start' | 'end';
}

export const helixCommands: Record<string, HelixCommand> = {
  // Movement
  h: {
    key: 'h',
    name: 'Move Left',
    description: 'Move cursor left one character',
    mode: 'normal',
    action: (state) => moveCursor(state, 0, -1),
  },
  j: {
    key: 'j',
    name: 'Move Down',
    description: 'Move cursor down one line',
    mode: 'normal',
    action: (state) => moveCursor(state, 1, 0),
  },
  k: {
    key: 'k',
    name: 'Move Up',
    description: 'Move cursor up one line',
    mode: 'normal',
    action: (state) => moveCursor(state, -1, 0),
  },
  l: {
    key: 'l',
    name: 'Move Right',
    description: 'Move cursor right one character',
    mode: 'normal',
    action: (state) => moveCursor(state, 0, 1),
  },
  w: {
    key: 'w',
    name: 'Next Word',
    description: 'Move to next word start',
    mode: 'normal',
    action: (state) => nextWord(state),
  },
  b: {
    key: 'b',
    name: 'Previous Word',
    description: 'Move to previous word start',
    mode: 'normal',
    action: (state) => prevWord(state),
  },
  e: {
    key: 'e',
    name: 'Next Word End',
    description: 'Move to next word end',
    mode: 'normal',
    action: (state) => nextWordEnd(state),
  },
  f: {
    key: 'f',
    name: 'Find',
    description: 'Find next character',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'normal', subMode: 'find' } }),
  },
  t: {
    key: 't',
    name: 'Till',
    description: 'Move till next character',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'normal', subMode: 'till' } }),
  },
  G: {
    key: 'G',
    name: 'Go to Line',
    description: 'Go to specific line number',
    mode: 'normal',
    action: (state) => goToEnd(state),
  },
  gg: {
    key: 'gg',
    name: 'Go to Top',
    description: 'Go to first line',
    mode: 'normal',
    action: (state) => goToStart(state),
  },
  
  // Selection
  x: {
    key: 'x',
    name: 'Select Line',
    description: 'Select current line, extend to next if already selected',
    mode: 'normal',
    action: (state) => selectLine(state),
  },
  X: {
    key: 'X',
    name: 'Extend to Line Bounds',
    description: 'Extend selection to line bounds',
    mode: 'normal',
    action: (state) => extendToLineBounds(state),
  },
  v: {
    key: 'v',
    name: 'Select Mode',
    description: 'Enter select (visual) mode',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'select' } }),
  },
  V: {
    key: 'V',
    name: 'Line Select Mode',
    description: 'Enter line-wise select mode',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'select', subMode: 'line' } }),
  },
  ';': {
    key: ';',
    name: 'Collapse Selection',
    description: 'Collapse selection to single cursor',
    mode: 'normal',
    action: (state) => collapseSelection(state),
  },
  ',': {
    key: ',',
    name: 'Keep Primary',
    description: 'Keep only primary selection',
    mode: 'normal',
    action: (state) => keepPrimarySelection(state),
  },
  C: {
    key: 'C',
    name: 'Copy Selection Down',
    description: 'Copy selection to next line (add cursor below)',
    mode: 'normal',
    action: (state) => copySelectionDown(state),
  },
  s: {
    key: 's',
    name: 'Split Selection',
    description: 'Split selection by regex',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'normal', subMode: 'split' } }),
  },
  
  // Changes
  i: {
    key: 'i',
    name: 'Insert',
    description: 'Insert before selection',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'insert' } }),
  },
  a: {
    key: 'a',
    name: 'Append',
    description: 'Insert after selection',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'insert' } }),
  },
  I: {
    key: 'I',
    name: 'Insert at Line Start',
    description: 'Insert at beginning of line',
    mode: 'normal',
    action: (state) => insertAtLineStart(state),
  },
  A: {
    key: 'A',
    name: 'Insert at Line End',
    description: 'Insert at end of line',
    mode: 'normal',
    action: (state) => insertAtLineEnd(state),
  },
  o: {
    key: 'o',
    name: 'Open Below',
    description: 'Open new line below',
    mode: 'normal',
    action: (state) => openBelow(state),
  },
  O: {
    key: 'O',
    name: 'Open Above',
    description: 'Open new line above',
    mode: 'normal',
    action: (state) => openAbove(state),
  },
  d: {
    key: 'd',
    name: 'Delete',
    description: 'Delete selection',
    mode: 'normal',
    action: (state) => deleteSelection(state),
  },
  c: {
    key: 'c',
    name: 'Change',
    description: 'Change selection (delete and insert)',
    mode: 'normal',
    action: (state) => ({ ...deleteSelection(state), mode: { type: 'insert' } }),
  },
  r: {
    key: 'r',
    name: 'Replace',
    description: 'Replace character',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'normal', subMode: 'replace' } }),
  },
  y: {
    key: 'y',
    name: 'Yank',
    description: 'Copy selection to register',
    mode: 'normal',
    action: (state) => yankSelection(state),
  },
  p: {
    key: 'p',
    name: 'Paste After',
    description: 'Paste after selection',
    mode: 'normal',
    action: (state) => pasteAfter(state),
  },
  P: {
    key: 'P',
    name: 'Paste Before',
    description: 'Paste before selection',
    mode: 'normal',
    action: (state) => pasteBefore(state),
  },
  J: {
    key: 'J',
    name: 'Join Lines',
    description: 'Join selected lines',
    mode: 'normal',
    action: (state) => joinLines(state),
  },
  '>': {
    key: '>',
    name: 'Indent',
    description: 'Indent selection',
    mode: 'normal',
    action: (state) => indentSelection(state),
  },
  '<': {
    key: '<',
    name: 'Unindent',
    description: 'Unindent selection',
    mode: 'normal',
    action: (state) => unindentSelection(state),
  },
  u: {
    key: 'u',
    name: 'Undo',
    description: 'Undo last change',
    mode: 'normal',
    action: (state) => state, // Handled separately
  },
  U: {
    key: 'U',
    name: 'Redo',
    description: 'Redo last undone change',
    mode: 'normal',
    action: (state) => state, // Handled separately
  },
  '~': {
    key: '~',
    name: 'Switch Case',
    description: 'Switch case of selection',
    mode: 'normal',
    action: (state) => switchCase(state),
  },
  
  // Surround
  m: {
    key: 'm',
    name: 'Match',
    description: 'Enter match mode for surrounds',
    mode: 'normal',
    action: (state) => ({ ...state, mode: { type: 'match' } }),
  },
};

// Helper functions
function moveCursor(state: EditorState, lineDelta: number, colDelta: number): EditorState {
  const lines = state.content.split('\n');
  const newLine = Math.max(0, Math.min(lines.length - 1, state.cursorPosition.line + lineDelta));
  const lineLength = lines[newLine]?.length || 0;
  const newCol = Math.max(0, Math.min(lineLength, state.cursorPosition.column + colDelta));
  
  return {
    ...state,
    cursorPosition: { line: newLine, column: newCol },
  };
}

function nextWord(state: EditorState): EditorState {
  // Simplified word navigation
  const lines = state.content.split('\n');
  const line = lines[state.cursorPosition.line];
  const after = line.slice(state.cursorPosition.column);
  const match = after.match(/^\s*\S+/);
  if (match) {
    return moveCursor(state, 0, match[0].length);
  }
  return state;
}

function prevWord(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  const line = lines[state.cursorPosition.line];
  const before = line.slice(0, state.cursorPosition.column);
  const match = before.match(/\S+\s*$/);
  if (match) {
    return {
      ...state,
      cursorPosition: {
        line: state.cursorPosition.line,
        column: before.lastIndexOf(match[0]),
      },
    };
  }
  return state;
}

function nextWordEnd(state: EditorState): EditorState {
  // Simplified implementation
  return moveCursor(state, 0, 2);
}

function goToEnd(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  return {
    ...state,
    cursorPosition: { line: lines.length - 1, column: lines[lines.length - 1].length },
  };
}

function goToStart(state: EditorState): EditorState {
  return {
    ...state,
    cursorPosition: { line: 0, column: 0 },
  };
}

function selectLine(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  const line = state.cursorPosition.line;
  
  return {
    ...state,
    selections: [{
      start: { line, column: 0 },
      end: { line, column: lines[line].length },
      cursor: 'end',
    }],
    cursorPosition: { line: line + 1, column: 0 },
  };
}

function extendToLineBounds(state: EditorState): EditorState {
  return state; // Simplified
}

function collapseSelection(state: EditorState): EditorState {
  return {
    ...state,
    selections: [],
  };
}

function keepPrimarySelection(state: EditorState): EditorState {
  return {
    ...state,
    selections: state.selections.slice(0, 1),
  };
}

function copySelectionDown(state: EditorState): EditorState {
  return {
    ...state,
    selections: [...state.selections, ...state.selections],
  };
}

function insertAtLineStart(state: EditorState): EditorState {
  return {
    ...state,
    cursorPosition: { line: state.cursorPosition.line, column: 0 },
    mode: { type: 'insert' },
  };
}

function insertAtLineEnd(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  return {
    ...state,
    cursorPosition: { line: state.cursorPosition.line, column: lines[state.cursorPosition.line].length },
    mode: { type: 'insert' },
  };
}

function openBelow(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  lines.splice(state.cursorPosition.line + 1, 0, '');
  return {
    ...state,
    content: lines.join('\n'),
    cursorPosition: { line: state.cursorPosition.line + 1, column: 0 },
    mode: { type: 'insert' },
  };
}

function openAbove(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  lines.splice(state.cursorPosition.line, 0, '');
  return {
    ...state,
    content: lines.join('\n'),
    cursorPosition: { line: state.cursorPosition.line, column: 0 },
    mode: { type: 'insert' },
  };
}

function deleteSelection(state: EditorState): EditorState {
  if (state.selections.length === 0) return state;
  
  let content = state.content;
  const lines = content.split('\n');
  
  // Simplified deletion - remove selected lines
  for (const sel of [...state.selections].sort((a, b) => b.start.line - a.start.line)) {
    lines.splice(sel.start.line, sel.end.line - sel.start.line + 1);
  }
  
  return {
    ...state,
    content: lines.join('\n'),
    selections: [],
  };
}

function yankSelection(state: EditorState): EditorState {
  return {
    ...state,
    registers: { ...state.registers, '"': getSelectedText(state) },
  };
}

function pasteAfter(state: EditorState): EditorState {
  const text = state.registers['"'] || '';
  const lines = state.content.split('\n');
  lines.splice(state.cursorPosition.line + 1, 0, text);
  return {
    ...state,
    content: lines.join('\n'),
  };
}

function pasteBefore(state: EditorState): EditorState {
  const text = state.registers['"'] || '';
  const lines = state.content.split('\n');
  lines.splice(state.cursorPosition.line, 0, text);
  return {
    ...state,
    content: lines.join('\n'),
  };
}

function joinLines(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  if (state.cursorPosition.line < lines.length - 1) {
    lines[state.cursorPosition.line] += ' ' + lines[state.cursorPosition.line + 1];
    lines.splice(state.cursorPosition.line + 1, 1);
  }
  return {
    ...state,
    content: lines.join('\n'),
  };
}

function indentSelection(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  for (const sel of state.selections) {
    for (let i = sel.start.line; i <= sel.end.line; i++) {
      lines[i] = '    ' + lines[i];
    }
  }
  return {
    ...state,
    content: lines.join('\n'),
  };
}

function unindentSelection(state: EditorState): EditorState {
  const lines = state.content.split('\n');
  for (const sel of state.selections) {
    for (let i = sel.start.line; i <= sel.end.line; i++) {
      lines[i] = lines[i].replace(/^    /, '');
    }
  }
  return {
    ...state,
    content: lines.join('\n'),
  };
}

function switchCase(state: EditorState): EditorState {
  const text = getSelectedText(state);
  const switched = text.split('').map(c => 
    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
  ).join('');
  
  return replaceSelectedText(state, switched);
}

function getSelectedText(state: EditorState): string {
  if (state.selections.length === 0) return '';
  const lines = state.content.split('\n');
  const sel = state.selections[0];
  return lines.slice(sel.start.line, sel.end.line + 1).join('\n');
}

function replaceSelectedText(state: EditorState, newText: string): EditorState {
  if (state.selections.length === 0) return state;
  const lines = state.content.split('\n');
  const sel = state.selections[0];
  lines.splice(sel.start.line, sel.end.line - sel.start.line + 1, newText);
  return {
    ...state,
    content: lines.join('\n'),
    selections: [],
  };
}
