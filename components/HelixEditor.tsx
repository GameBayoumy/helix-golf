'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Keyboard,
  X,
  Move,
  Target,
  Scissors,
  Braces,
  Undo
} from 'lucide-react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPos, setCursorPos] = useState(0);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (readOnly) return;
    
    setKeystrokes(prev => prev + 1);
    onKeystroke(e.key);

    if (mode === 'normal') {
      // Movement keys
      if ('hjkl'.includes(e.key)) {
        e.preventDefault();
        // Simulate movement (in real Helix this would move cursor)
        return;
      }
      
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
      } else if ('xXdcywbeWEB'.includes(e.key)) {
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
      if (e.key === 'Escape') {
        e.preventDefault();
        setMode('normal');
        setPendingCommand(null);
      } else if (e.key === 'i' || e.key === 'a') {
        e.preventDefault();
        setPendingCommand(e.key);
      } else if ('([{\'"])}'.includes(e.key) && pendingCommand) {
        e.preventDefault();
        setMode('normal');
        setPendingCommand(null);
      } else {
        e.preventDefault();
      }
    }
  }, [mode, readOnly, onKeystroke, pendingCommand]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
    setCursorPos(e.target.selectionStart);
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

  // Calculate line numbers
  const lines = content.split('\n');

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
      <div className="flex-1 relative flex">
        {/* Line numbers */}
        <div className="w-12 bg-[#1a1a25] border-r border-[#3a3a3a] py-4 text-right select-none">
          {lines.map((_, i) => (
            <div 
              key={i} 
              className="px-2 text-xs text-[#6b6560] font-mono leading-6"
            >
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 bg-[#2d2a26] text-[#faf8f5] p-4 font-mono text-sm resize-none outline-none border-none"
          style={{ 
            fontFamily: 'JetBrains Mono, monospace', 
            lineHeight: '1.5',
            tabSize: 2
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
