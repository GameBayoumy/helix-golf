'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Challenge, Keystroke } from '@/types/challenge';
import { validateChallenge } from '@/lib/validator';

interface KeybindingCaptureProps {
  challenge: Challenge;
  currentContent: string;
  onContentChange: (content: string) => void;
  onKeystroke: (key: string) => void;
  onComplete: (success: boolean) => void;
  isActive: boolean;
}

export default function KeybindingCapture({
  challenge,
  currentContent,
  onContentChange,
  onKeystroke,
  onComplete,
  isActive,
}: KeybindingCaptureProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'normal' | 'insert' | 'select' | 'match'>('normal');
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [commandBuffer, setCommandBuffer] = useState('');
  const [selections, setSelections] = useState<Array<{ start: number; end: number }>>([]);
  const [cursorPos, setCursorPos] = useState(0);

  useEffect(() => {
    if (textareaRef.current && isActive) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  // Check completion
  useEffect(() => {
    if (validateChallenge(challenge.initial, challenge.target, currentContent)) {
      onComplete(true);
    }
  }, [currentContent, challenge, onComplete]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive) return;

    const key = e.key;
    onKeystroke(key);

    // Always allow Escape to return to normal mode
    if (key === 'Escape') {
      e.preventDefault();
      setMode('normal');
      setPendingCommand(null);
      setCommandBuffer('');
      return;
    }

    // Handle different modes
    if (mode === 'normal') {
      handleNormalMode(e);
    } else if (mode === 'insert') {
      // Allow typing in insert mode
      if (key === 'Backspace' || key === 'Delete' || key.length === 1) {
        // Let it pass through
      }
    } else if (mode === 'select') {
      handleSelectMode(e);
    } else if (mode === 'match') {
      handleMatchMode(e);
    }
  };

  const handleNormalMode = (e: React.KeyboardEvent) => {
    const key = e.key;

    // Movement keys
    if ('hjklwbefHJKLWBEF'.includes(key)) {
      e.preventDefault();
      simulateMovement(key);
      return;
    }

    // Mode switches
    switch (key) {
      case 'i':
        e.preventDefault();
        setMode('insert');
        break;
      case 'v':
        e.preventDefault();
        setMode('select');
        break;
      case 'V':
        e.preventDefault();
        setMode('select');
        // Line-wise selection
        selectLine();
        break;
      case 'm':
        e.preventDefault();
        setMode('match');
        setPendingCommand(null);
        break;
      case 'x':
        e.preventDefault();
        selectCurrentLine();
        break;
      case 'd':
        e.preventDefault();
        deleteSelection();
        break;
      case 'c':
        e.preventDefault();
        deleteSelection();
        setMode('insert');
        break;
      case 'y':
        e.preventDefault();
        // Yank (copy) - would implement with clipboard
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        // Paste - would implement with clipboard
        break;
      case 'r':
        e.preventDefault();
        setPendingCommand('r');
        break;
      case '~':
        e.preventDefault();
        switchCase();
        break;
      case '>':
        e.preventDefault();
        indentLine();
        break;
      case '<':
        e.preventDefault();
        unindentLine();
        break;
      case 'J':
        e.preventDefault();
        joinLines();
        break;
      case ';':
        e.preventDefault();
        setSelections([]);
        break;
      case ',':
        e.preventDefault();
        keepPrimarySelection();
        break;
      case 'C':
        e.preventDefault();
        copySelectionDown();
        break;
      case 'g':
        e.preventDefault();
        setCommandBuffer('g');
        break;
      case 'G':
        e.preventDefault();
        if (commandBuffer === 'g') {
          goToStart();
        } else {
          goToEnd();
        }
        setCommandBuffer('');
        break;
      case '0':
        e.preventDefault();
        goToLineStart();
        break;
      case '$':
        e.preventDefault();
        goToLineEnd();
        break;
      case '%':
        e.preventDefault();
        selectAll();
        break;
    }

    // Complete gg command
    if (commandBuffer === 'g' && key === 'g') {
      e.preventDefault();
      goToStart();
      setCommandBuffer('');
    }

    // Handle pending replace command
    if (pendingCommand === 'r' && key.length === 1) {
      e.preventDefault();
      replaceChar(key);
      setPendingCommand(null);
    }
  };

  const handleSelectMode = (e: React.KeyboardEvent) => {
    const key = e.key;
    
    // Movement extends selection
    if ('hjkl'.includes(key)) {
      e.preventDefault();
      extendSelection(key);
    }
  };

  const handleMatchMode = (e: React.KeyboardEvent) => {
    const key = e.key;

    if (key === 'i' || key === 'a') {
      e.preventDefault();
      setPendingCommand(key);
    } else if (pendingCommand && '([{\'""])}'.includes(key)) {
      e.preventDefault();
      performMatch(pendingCommand, key);
      setMode('normal');
      setPendingCommand(null);
    }
  };

  // Editor operations
  const simulateMovement = (key: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lines = currentContent.split('\n');
    let { line, col } = getLineCol(currentContent, textarea.selectionStart);

    switch (key) {
      case 'h':
      case 'H':
        col = Math.max(0, col - 1);
        break;
      case 'l':
      case 'L':
        col = Math.min(lines[line].length, col + 1);
        break;
      case 'j':
      case 'J':
        line = Math.min(lines.length - 1, line + 1);
        col = Math.min(col, lines[line].length);
        break;
      case 'k':
      case 'K':
        line = Math.max(0, line - 1);
        col = Math.min(col, lines[line].length);
        break;
      case 'w':
      case 'W':
        ({ line, col } = nextWord(lines, line, col));
        break;
      case 'b':
      case 'B':
        ({ line, col } = prevWord(lines, line, col));
        break;
      case 'e':
      case 'E':
        ({ line, col } = nextWordEnd(lines, line, col));
        break;
      case 'f':
      case 'F':
        // Would need next char input
        break;
    }

    const newPos = getAbsolutePos(currentContent, line, col);
    setCursorPos(newPos);
    textarea.setSelectionRange(newPos, newPos);
  };

  const getLineCol = (content: string, pos: number) => {
    const lines = content.slice(0, pos).split('\n');
    return {
      line: lines.length - 1,
      col: lines[lines.length - 1].length,
    };
  };

  const getAbsolutePos = (content: string, line: number, col: number) => {
    const lines = content.split('\n');
    let pos = 0;
    for (let i = 0; i < line; i++) {
      pos += lines[i].length + 1; // +1 for newline
    }
    return pos + col;
  };

  const nextWord = (lines: string[], line: number, col: number) => {
    const text = lines[line].slice(col);
    const match = text.match(/\S+\s*/);
    if (match) {
      col += match[0].length;
    }
    return { line, col };
  };

  const prevWord = (lines: string[], line: number, col: number) => {
    const text = lines[line].slice(0, col);
    const match = text.match(/\s*\S+$/);
    if (match) {
      col = text.lastIndexOf(match[0]);
    }
    return { line, col };
  };

  const nextWordEnd = (lines: string[], line: number, col: number) => {
    const text = lines[line].slice(col + 1);
    const match = text.match(/\S+/);
    if (match) {
      col += match[0].length;
    }
    return { line, col };
  };

  const selectCurrentLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { line } = getLineCol(currentContent, textarea.selectionStart);
    const lines = currentContent.split('\n');
    const start = getAbsolutePos(currentContent, line, 0);
    const end = getAbsolutePos(currentContent, line, lines[line].length);
    
    setSelections([{ start, end }]);
    textarea.setSelectionRange(start, end);
  };

  const selectLine = () => {
    selectCurrentLine();
  };

  const extendSelection = (key: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    let newStart = start;
    let newEnd = end;

    switch (key) {
      case 'h':
        newStart = Math.max(0, start - 1);
        break;
      case 'l':
        newEnd = Math.min(currentContent.length, end + 1);
        break;
    }

    textarea.setSelectionRange(newStart, newEnd);
  };

  const deleteSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      // Delete current character
      const newContent = currentContent.slice(0, start) + currentContent.slice(start + 1);
      onContentChange(newContent);
    } else {
      // Delete selection
      const newContent = currentContent.slice(0, start) + currentContent.slice(end);
      onContentChange(newContent);
      textarea.setSelectionRange(start, start);
    }
  };

  const replaceChar = (char: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const pos = textarea.selectionStart;
    const newContent = currentContent.slice(0, pos) + char + currentContent.slice(pos + 1);
    onContentChange(newContent);
  };

  const switchCase = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      // Switch case of current character
      const char = currentContent[start];
      const switched = char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
      const newContent = currentContent.slice(0, start) + switched + currentContent.slice(start + 1);
      onContentChange(newContent);
    } else {
      // Switch case of selection
      const selected = currentContent.slice(start, end);
      const switched = selected.split('').map(c => 
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      ).join('');
      const newContent = currentContent.slice(0, start) + switched + currentContent.slice(end);
      onContentChange(newContent);
    }
  };

  const indentLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { line } = getLineCol(currentContent, textarea.selectionStart);
    const lines = currentContent.split('\n');
    lines[line] = '    ' + lines[line];
    onContentChange(lines.join('\n'));
  };

  const unindentLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { line } = getLineCol(currentContent, textarea.selectionStart);
    const lines = currentContent.split('\n');
    lines[line] = lines[line].replace(/^    /, '');
    onContentChange(lines.join('\n'));
  };

  const joinLines = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { line } = getLineCol(currentContent, textarea.selectionStart);
    const lines = currentContent.split('\n');
    
    if (line < lines.length - 1) {
      lines[line] = lines[line] + ' ' + lines[line + 1];
      lines.splice(line + 1, 1);
      onContentChange(lines.join('\n'));
    }
  };

  const keepPrimarySelection = () => {
    setSelections(selections.slice(0, 1));
  };

  const copySelectionDown = () => {
    // Multi-cursor: copy current selection to next line
    setSelections([...selections, ...selections]);
  };

  const goToStart = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.setSelectionRange(0, 0);
  };

  const goToEnd = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.setSelectionRange(currentContent.length, currentContent.length);
  };

  const goToLineStart = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { line } = getLineCol(currentContent, textarea.selectionStart);
    const pos = getAbsolutePos(currentContent, line, 0);
    textarea.setSelectionRange(pos, pos);
  };

  const goToLineEnd = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { line } = getLineCol(currentContent, textarea.selectionStart);
    const lines = currentContent.split('\n');
    const pos = getAbsolutePos(currentContent, line, lines[line].length);
    textarea.setSelectionRange(pos, pos);
  };

  const selectAll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.setSelectionRange(0, currentContent.length);
  };

  const performMatch = (type: string, delimiter: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const pos = textarea.selectionStart;
    const matchPairs: Record<string, [string, string]> = {
      '(': ['(', ')'],
      ')': ['(', ')'],
      '[': ['[', ']'],
      ']': ['[', ']'],
      '{': ['{', '}'],
      '}': ['{', '}'],
    };

    const [open, close] = matchPairs[delimiter] || [delimiter, delimiter];

    if (type === 'i') {
      // Match inside: find content between delimiters
      const after = currentContent.slice(pos);
      const openIdx = after.indexOf(open);
      const closeIdx = after.indexOf(close, openIdx + 1);
      
      if (openIdx !== -1 && closeIdx !== -1) {
        const start = pos + openIdx + 1;
        const end = pos + closeIdx;
        textarea.setSelectionRange(start, end);
        setSelections([{ start, end }]);
      }
    } else if (type === 'a') {
      // Match around: include delimiters
      const after = currentContent.slice(pos);
      const openIdx = after.indexOf(open);
      const closeIdx = after.indexOf(close, openIdx + 1);
      
      if (openIdx !== -1 && closeIdx !== -1) {
        const start = pos + openIdx;
        const end = pos + closeIdx + 1;
        textarea.setSelectionRange(start, end);
        setSelections([{ start, end }]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={currentContent}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="w-full h-full bg-transparent text-transparent caret-white resize-none focus:outline-none font-mono text-sm leading-6 p-4"
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
    />
  );
}
