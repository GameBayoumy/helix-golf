'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { motion } from 'framer-motion';
import { HelixMode, Keystroke } from '@/types/challenge';
import { 
  Command, 
  CornerDownLeft, 
  Delete, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  Scissors,
  Copy,
  ClipboardPaste,
  Undo,
  Redo,
  Indent,
  Outdent,
  WrapText,
  Type,
  Move,
  Target,
  Lightbulb,
  ChevronRight,
  Keyboard,
  Layers,
  Quote,
  Braces,
  Parentheses,
  Brackets,
  X
} from 'lucide-react';

interface HelixEditorProps {
  initialContent: string;
  targetContent: string;
  onContentChange: (content: string) => void;
  onKeystroke: (key: string) => void;
  readOnly?: boolean;
  showMode?: boolean;
}

export default function HelixEditor({
  initialContent,
  targetContent,
  onContentChange,
  onKeystroke,
  readOnly = false,
  showMode = true,
}: HelixEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<HelixMode>({ type: 'normal' });
  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [showKeyGuide, setShowKeyGuide] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (readOnly) return;
    
    // Track keystroke
    const key = e.key;
    setKeystrokes(prev => [...prev, { key, timestamp: Date.now() }]);
    onKeystroke(key);

    // Handle Helix-style keybindings
    if (mode.type === 'normal') {
      handleNormalModeKey(e);
    } else if (mode.type === 'insert') {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMode({ type: 'normal' });
      }
    } else if (mode.type === 'select') {
      handleSelectModeKey(e);
    } else if (mode.type === 'match') {
      handleMatchModeKey(e);
    }
  }, [mode, readOnly, onKeystroke]);

  const handleNormalModeKey = (e: KeyboardEvent) => {
    const key = e.key;
    
    // Prevent default for Helix keys
    if ('hjklwebWEBxXvVdcyYpPoaIArfFtT~mJ;,%'.includes(key) || 
        key === 'Escape' || key === 'Enter' || key === 'Backspace' ||
        key === '>' || key === '<' || key === 'Tab' ||
        key === 'g' || key === 'G' || key === 'C' || key === 's' ||
        key === 'u' || key === 'U' || key === ',' || key === '.' ||
        key === '/' || key === '?' || key === 'n' || key === 'N') {
      e.preventDefault();
    }

    switch (key) {
      case 'i':
        setMode({ type: 'insert' });
        break;
      case 'v':
        setMode({ type: 'select' });
        break;
      case 'V':
        setMode({ type: 'select', subMode: 'line' });
        break;
      case 'm':
        setMode({ type: 'match' });
        break;
      case 'Escape':
        setMode({ type: 'normal' });
        setPendingCommand(null);
        break;
    }
  };

  const handleSelectModeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setMode({ type: 'normal' });
    }
  };

  const handleMatchModeKey = (e: KeyboardEvent) => {
    e.preventDefault();
    // Handle match mode sub-commands (i, a for inside/around)
    if (e.key === 'i' || e.key === 'a') {
      setPendingCommand(e.key);
    } else if ('([{\'""])}'.includes(e.key) && pendingCommand) {
      // Complete the match command (e.g., mi(), ma[)
      setMode({ type: 'normal' });
      setPendingCommand(null);
    } else if (e.key === 'Escape') {
      setMode({ type: 'normal' });
      setPendingCommand(null);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onContentChange(value);
    }
  };

  const getModeColor = () => {
    switch (mode.type) {
      case 'normal':
        return 'bg-blue-500';
      case 'insert':
        return 'bg-green-500';
      case 'select':
        return 'bg-purple-500';
      case 'match':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getModeLabel = () => {
    if (pendingCommand) {
      return `MATCH ${pendingCommand.toUpperCase()}`;
    }
    return mode.type.toUpperCase();
  };

  const getRecentKeys = () => {
    return keystrokes.slice(-5).map(k => k.key).join(' ');
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-md text-xs font-bold text-white ${getModeColor()} transition-colors`}>
            {getModeLabel()}
          </div>
          {pendingCommand && (
            <span className="text-xs text-slate-400">
              Waiting for delimiter...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowKeyGuide(!showKeyGuide)}
            className={`p-2 rounded-md transition-colors ${showKeyGuide ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          >
            <Keyboard size={16} />
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          value={content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            padding: { top: 16, bottom: 16 },
            automaticLayout: true,
            contextmenu: false,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            wordWrap: 'on',
          }}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />

        {/* Key Guide Overlay */}
        {showKeyGuide && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 right-4 w-80 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-2xl p-4 z-10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Key Guide</span>
              <button 
                onClick={() => setShowKeyGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <KeyGroup title="Movement" icon={<Move size={14} />} color="text-blue-400">
                <KeyItem keys={['h', 'j', 'k', 'l']} desc="Left, Down, Up, Right" />
                <KeyItem keys={['w', 'b', 'e']} desc="Next/prev word, word end" />
                <KeyItem keys={['W', 'B', 'E']} desc="WORD (space-separated)" />
                <KeyItem keys={['f', 't']} desc="Find/till character" />
                <KeyItem keys={['gg', 'G']} desc="Go to first/last line" />
              </KeyGroup>
              
              <KeyGroup title="Selection" icon={<Target size={14} />} color="text-purple-400">
                <KeyItem keys={['x']} desc="Select line, extend to next" />
                <KeyItem keys={['v', 'V']} desc="Select mode, line-wise" />
                <KeyItem keys={[';']} desc="Collapse to cursor" />
                <KeyItem keys={['C']} desc="Copy selection down" />
                <KeyItem keys={['s']} desc="Split on regex" />
                <KeyItem keys={['%']} desc="Select entire file" />
              </KeyGroup>
              
              <KeyGroup title="Changes" icon={<Scissors size={14} />} color="text-orange-400">
                <KeyItem keys={['i', 'a']} desc="Insert before/after" />
                <KeyItem keys={['I', 'A']} desc="Insert at line start/end" />
                <KeyItem keys={['o', 'O']} desc="Open below/above" />
                <KeyItem keys={['d']} desc="Delete selection" />
                <KeyItem keys={['c']} desc="Change (delete + insert)" />
                <KeyItem keys={['y', 'p', 'P']} desc="Yank, paste after/before" />
                <KeyItem keys={['r']} desc="Replace character" />
                <KeyItem keys={['~']} desc="Switch case" />
                <KeyItem keys={['>', '<']} desc="Indent, unindent" />
                <KeyItem keys={['J']} desc="Join lines" />
              </KeyGroup>
              
              <KeyGroup title="Surround" icon={<Braces size={14} />} color="text-pink-400">
                <KeyItem keys={['m']} desc="Enter match mode" />
                <KeyItem keys={['mi(', 'ma(']} desc="Match inside/around ()" />
                <KeyItem keys={['mi[', 'ma[']} desc="Match inside/around []" />
                <KeyItem keys={['mi{', 'ma{']} desc="Match inside/around {}" />
                <KeyItem keys={['ms"']} desc="Add surround" />
                <KeyItem keys={['mr("']} desc="Replace surround" />
                <KeyItem keys={['md"']} desc="Delete surround" />
              </KeyGroup>
              
              <KeyGroup title="Multi-cursor" icon={<Layers size={14} />} color="text-cyan-400">
                <KeyItem keys={['C']} desc="Copy selection to next line" />
                <KeyItem keys={['s']} desc="Split selection" />
                <KeyItem keys={[',']} desc="Keep primary selection" />
              </KeyGroup>
              
              <KeyGroup title="History" icon={<Undo size={14} />} color="text-gray-400">
                <KeyItem keys={['u', 'U']} desc="Undo, redo" />
                <KeyItem keys={['.']} desc="Repeat last insert" />
              </KeyGroup>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-700 rounded">Esc</span>
                <span>to return to NORMAL mode</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>{keystrokes.length} keystrokes</span>
          {keystrokes.length > 0 && (
            <span className="text-slate-500">
              Recent: <span className="text-slate-300 font-mono">{getRecentKeys()}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">HelixGolf</span>
        </div>
      </div>
    </div>
  );
}

function KeyGroup({ title, icon, color, children }: { 
  title: string; 
  icon: React.ReactNode; 
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={`flex items-center gap-2 mb-2 text-xs font-semibold ${color}`}>
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function KeyItem({ keys, desc }: { keys: string[]; desc: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-200 font-mono">
            {key}
          </span>
        ))}
      </div>
      <span className="text-slate-500">{desc}</span>
    </div>
  );
}
