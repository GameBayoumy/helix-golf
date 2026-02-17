'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { 
  Keyboard,
  X,
  Move,
  Target,
  Scissors,
  Braces,
  Undo,
  AlertCircle
} from 'lucide-react';

// Configure Monaco loader to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs'
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
  targetContent,
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Setup Helix theme when editor mounts
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    try {
      // Define custom Helix theme
      monaco.editor.defineTheme('helix', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: 'faf8f5', background: '2d2a26' },
          { token: 'comment', foreground: '6b6560', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'd4a574' },
          { token: 'string', foreground: '7a9e7e' },
          { token: 'number', foreground: 'c4705a' },
        ],
        colors: {
          'editor.background': '#2d2a26',
          'editor.foreground': '#faf8f5',
          'editor.lineHighlightBackground': '#3a3a3a40',
          'editor.selectionBackground': '#c4705a40',
          'editor.selectionHighlightBackground': '#c4705a20',
          'editorCursor.foreground': '#c4705a',
          'editorLineNumber.foreground': '#6b6560',
          'editorLineNumber.activeForeground': '#faf8f5',
          'editor.inactiveSelectionBackground': '#c4705a20',
        }
      });

      monaco.editor.setTheme('helix');
      
      // Setup keybindings
      setupHelixKeybindings(editor, monaco);
      
      setEditorLoaded(true);
      setLoadError(null);
      
      // Focus editor
      editor.focus();
    } catch (err) {
      console.error('Monaco initialization error:', err);
      setLoadError('Failed to initialize editor');
    }
  };

  const setupHelixKeybindings = (editor: editor.IStandaloneCodeEditor, monaco: any) => {
    // Movement keys - only active in normal mode
    const addCommand = (keybinding: number, command: string) => {
      editor.addCommand(keybinding, () => {
        if (mode === 'normal') {
          handleHelixCommand(command);
        }
      });
    };

    // Add movement commands
    addCommand(monaco.KeyCode.KeyH, 'cursorLeft');
    addCommand(monaco.KeyCode.KeyJ, 'cursorDown');
    addCommand(monaco.KeyCode.KeyK, 'cursorUp');
    addCommand(monaco.KeyCode.KeyL, 'cursorRight');

    // Mode switching
    editor.addCommand(monaco.KeyCode.KeyI, () => {
      if (mode === 'normal') {
        setMode('insert');
      }
    });

    editor.addCommand(monaco.KeyCode.KeyV, () => {
      if (mode === 'normal') {
        setMode('select');
      }
    });

    editor.addCommand(monaco.KeyCode.KeyM, () => {
      if (mode === 'normal') {
        setMode('match');
        setPendingCommand(null);
      }
    });

    // Escape to normal mode
    editor.addCommand(monaco.KeyCode.Escape, () => {
      setMode('normal');
      setPendingCommand(null);
    });

    // Track keystrokes
    editor.onKeyDown((e) => {
      setKeystrokes(prev => prev + 1);
      onKeystroke(e.browserEvent.key);
    });
  };

  const handleHelixCommand = (commandId: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.trigger('helix', commandId, {});
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onContentChange(value);
    }
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

  // Fallback textarea when Monaco fails
  if (loadError) {
    return (
      <div className="flex flex-col h-full bg-[#2d2a26]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a25] border-b border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded text-xs font-bold ${getModeColor()}`}>
              {getModeLabel()}
            </div>
            <span className="text-xs text-[#9a948e]">Fallback Mode</span>
          </div>
          <span className="text-xs text-[#9a948e]">{keystrokes} keys</span>
        </div>

        {/* Error Message */}
        <div className="px-4 py-2 bg-[#c4705a]/20 border-b border-[#c4705a]/30">
          <div className="flex items-center gap-2 text-xs text-[#c4705a]">
            <AlertCircle size={14} />
            <span>Editor failed to load. Using fallback.</span>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => handleEditorChange(e.target.value)}
          className="flex-1 bg-[#2d2a26] text-[#faf8f5] p-4 font-mono text-sm resize-none outline-none"
          style={{ fontFamily: 'JetBrains Mono, monospace', lineHeight: '1.5' }}
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2d2a26]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a25] border-b border-[#3a3a3a]">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded text-xs font-bold ${getModeColor()} transition-colors`}>
            {getModeLabel()}
          </div>
          
          {pendingCommand && mode === 'match' && (
            <span className="text-xs text-[#9a948e]">Type delimiter</span>
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
          theme="helix"
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full text-[#9a948e]">
              <span className="text-sm">Loading Monaco Editor...</span>
            </div>
          }
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
            cursorStyle: 'line',
            cursorBlinking: 'blink',
          }}
        />

        {/* Key Guide Overlay */}
        {showKeyGuide && (
          <div className="absolute top-4 right-4 w-80 bg-[#1a1a25]/98 rounded-lg border border-[#3a3a3a] shadow-2xl p-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#faf8f5]">Helix Key Guide</span>
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
              </KeyGroup>
              
              <KeyGroup title="History" icon={<Undo size={14} />} color="text-[#9a948e]">
                <KeyItem keys="u U" desc="Undo/redo" />
                <KeyItem keys="." desc="Repeat" />
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
