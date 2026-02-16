'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { 
  Keyboard,
  X,
  Move,
  Target,
  Scissors,
  Braces,
  Undo
} from 'lucide-react';

// Configure Monaco loader for CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs'
  }
});

interface HelixEditorProps {
  initialContent: string;
  targetContent: string;
  onContentChange: (content: string) => void;
  onKeystroke: (key: string) => void;
  readOnly?: boolean;
}

type HelixMode = 'normal' | 'insert' | 'select' | 'match';

export default function HelixEditor({
  initialContent,
  onContentChange,
  onKeystroke,
  readOnly = false,
}: HelixEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<HelixMode>('normal');
  const [keystrokes, setKeystrokes] = useState(0);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [showKeyGuide, setShowKeyGuide] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (readOnly) return;
    
    setKeystrokes(prev => prev + 1);
    onKeystroke(e.key);

    if (mode === 'normal') {
      if (e.key === 'i') {
        e.preventDefault();
        setMode('insert');
      } else if (e.key === 'v') {
        e.preventDefault();
        setMode('select');
      } else if (e.key === 'm') {
        e.preventDefault();
        setMode('match');
        setPendingCommand(null);
      } else if ('hjklxXdcywbeWEB'.includes(e.key)) {
        e.preventDefault();
      }
    } else if (mode === 'insert') {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMode('normal');
      }
    } else if (mode === 'select') {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMode('normal');
      }
    } else if (mode === 'match') {
      e.preventDefault();
      if (e.key === 'i' || e.key === 'a') {
        setPendingCommand(e.key);
      } else if (e.key === 'Escape') {
        setMode('normal');
        setPendingCommand(null);
      } else if ('([{\'"])}'.includes(e.key) && pendingCommand) {
        setMode('normal');
        setPendingCommand(null);
      }
    }
  }, [mode, readOnly, onKeystroke, pendingCommand]);

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

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
    setEditorLoaded(true);
  };

  const getModeColor = () => {
    switch (mode) {
      case 'normal': return 'bg-[#7a9e7e] text-white';
      case 'insert': return 'bg-[#c4705a] text-white';
      case 'select': return 'bg-[#a855f7] text-white';
      case 'match': return 'bg-[#d4a574] text-white';
      default: return 'bg-[#9a948e] text-white';
    }
  };

  const getModeLabel = () => {
    if (pendingCommand && mode === 'match') {
      return `MATCH ${pendingCommand.toUpperCase()}`;
    }
    return mode.toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2a26]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a25] border-b border-[#3a3a3a]">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded text-xs font-bold ${getModeColor()} transition-colors`}>
            {getModeLabel()}
          </div>
          
          {pendingCommand && mode === 'match' && (
            <span className="text-xs text-[#9a948e]">
              Type delimiter
            </span>
          )}
          
          {!editorLoaded && (
            <span className="text-xs text-[#9a948e]">Loading editor...</span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#9a948e]">{keystrokes} keys</span>
          
          <button
            onClick={() => setShowKeyGuide(!showKeyGuide)}
            className={`p-2 rounded transition-colors ${
              showKeyGuide 
                ? 'bg-[#3a3a3a] text-[#faf8f5]' 
                : 'text-[#9a948e] hover:text-[#faf8f5]'
            }`}
          >
            <Keyboard size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={content}
          onChange={handleEditorChange}
          theme="vs-dark"
          onMount={handleEditorMount}
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
            renderLineHighlight: 'all',
            lineHeight: 24,
          }}
        />

        {/* Key Guide Overlay */}
        {showKeyGuide && (
          <div className="absolute top-4 right-4 w-80 bg-[#1a1a25]/98 rounded-lg border border-[#3a3a3a] shadow-2xl p-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#faf8f5]">Key Guide</span>
              <button 
                onClick={() => setShowKeyGuide(false)}
                className="text-[#9a948e] hover:text-[#faf8f5]"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              <KeyGroup title="Movement" icon={<Move size={14} />} color="text-[#7a9e7e]">
                <KeyItem keys="hjkl" desc="Left, Down, Up, Right" />
                <KeyItem keys="w b e" desc="Word navigation" />
                <KeyItem keys="gg G" desc="First/last line" />
              </KeyGroup>
              
              <KeyGroup title="Selection" icon={<Target size={14} />} color="text-[#a855f7]">
                <KeyItem keys="x" desc="Select line" />
                <KeyItem keys="v V" desc="Select mode" />
                <KeyItem keys=";" desc="Collapse selection" />
              </KeyGroup>
              
              <KeyGroup title="Changes" icon={<Scissors size={14} />} color="text-[#c4705a]">
                <KeyItem keys="i a" desc="Insert before/after" />
                <KeyItem keys="d" desc="Delete" />
                <KeyItem keys="c" desc="Change" />
                <KeyItem keys="y p P" desc="Yank/paste" />
              </KeyGroup>
              
              <KeyGroup title="Surround" icon={<Braces size={14} />} color="text-[#d4a574]">
                <KeyItem keys="m" desc="Match mode" />
                <KeyItem keys="mi( ma(" desc="Inside/around ()" />
                <KeyItem keys='ms"' desc='Add surround' />
                <KeyItem keys='md"' desc='Delete surround' />
              </KeyGroup>
              
              <KeyGroup title="History" icon={<Undo size={14} />} color="text-[#9a948e]">
                <KeyItem keys="u U" desc="Undo/redo" />
                <KeyItem keys="." desc="Repeat last insert" />
              </KeyGroup>
            </div>
            
            <div className="mt-4 pt-3 border-t border-[#3a3a3a]">
              <div className="flex items-center gap-2 text-xs text-[#9a948e]">
                <span className="px-2 py-1 bg-[#3a3a3a] rounded">Esc</span>
                <span>to return to NORMAL</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KeyGroup({ 
  title, 
  icon, 
  color, 
  children 
}: { 
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
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function KeyItem({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <code className="px-1.5 py-0.5 bg-[#3a3a3a] rounded text-[#faf8f5] font-mono">
        {keys}
      </code>
      <span className="text-[#9a948e]">{desc}</span>
    </div>
  );
}
