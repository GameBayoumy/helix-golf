'use client';

import { useState, useEffect, useRef } from 'react';

export default function InteractiveHeroDemo() {
  const [mode, setMode] = useState('normal');
  const [input, setInput] = useState('');
  const [selection, setSelection] = useState<{ text: string; active: boolean }>({ text: 'name', active: true });
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuccess) {
      // Reset on any key after success
      setShowSuccess(false);
      setSelection({ text: 'name', active: true });
      setInput('');
      setMode('normal');
      return;
    }

    // Capture the key
    const key = e.key;
    
    if (key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
      return;
    }

    if (key.length === 1) {
      const newInput = input + key;
      setInput(newInput);

      // Check for ms" command
      if (newInput === 'ms"') {
        setTimeout(() => {
          setSelection({ text: '"name"', active: false });
          setShowSuccess(true);
          setMode('normal');
        }, 200);
      }
      // Check for partial command feedback
      else if (newInput === 'm') {
        setMode('match');
      }
      else if (newInput === 'ms') {
        setMode('surround');
      }
    }

    // Reset on Escape
    if (key === 'Escape') {
      setInput('');
      setMode('normal');
      setSelection({ text: 'name', active: true });
    }
  };

  const getModeDisplay = () => {
    switch (mode) {
      case 'match': return { text: 'MATCH', color: '#d4a574' };
      case 'surround': return { text: 'SURROUND', color: '#c4705a' };
      default: return { text: 'NORMAL', color: '#7a9e7e' };
    }
  };

  const modeInfo = getModeDisplay();

  return (
    <div 
      className="terminal-warm max-w-lg ml-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-header-warm">
        <div className="flex gap-2">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
        </div>
        <span className="text-sm text-[#9a948e] ml-4">challenge_01.rs — Click to type</span>
      </div>
      
      <div className="p-6 font-mono text-sm text-[#faf8f5] relative">
        {/* Hidden input for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 inset-0 w-full h-full cursor-text"
          autoFocus
        />

        <div className="flex items-center gap-3 mb-4 text-[#9a948e]">
          <span style={{ color: modeInfo.color }}>{modeInfo.text}</span>
          {input && <span className="text-[#faf8f5]">{input}</span>}
          <span 
            className="inline-block w-2 h-4 bg-[#faf8f5]"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          />
          {mode === 'surround' && (
            <span className="text-xs opacity-60">— press " to wrap</span>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex">
            <span className="text-[#6b6560] w-6">1</span>
            <span className="text-[#9a948e]">fn </span>
            <span className="text-[#d4a574]">greet</span>
            <span className="text-[#faf8f5]">(</span>
            {selection.active ? (
              <span className="bg-[#c4705a]/30 px-1 rounded">{selection.text}</span>
            ) : (
              <span className="text-[#7a9e7e]">{selection.text}</span>
            )}
            <span className="text-[#faf8f5]">) {}</span>
          </div>
          
          <div className="flex opacity-40">
            <span className="text-[#6b6560] w-6">2</span>
            <span>
              {showSuccess 
                ? "// Perfect! ms\" wraps selection in quotes" 
                : "// Type ms\" to wrap selection"}
            </span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-[#4a4540] flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className={selection.active ? "text-[#7a9e7e]" : "text-[#d4a574]"}>
              {selection.active ? "● 1 selection" : "✓ changed"}
            </span>
            <span className="text-[#9a948e]">
              {selection.text.length} chars
            </span>
          </div>
          {showSuccess && (
            <span className="text-[#7a9e7e]">Press any key to reset</span>
          )}
        </div>
      </div>

      {/* Floating Key Hint */}
      <div 
        className="absolute -bottom-4 -left-4 bg-white border border-[#e8e3db] rounded-lg p-4 shadow-xl transition-all duration-300"
        style={{ 
          transform: showSuccess ? 'rotate(0deg) scale(1.05)' : 'rotate(-2deg)',
          borderColor: showSuccess ? '#7a9e7e' : '#e8e3db'
        }}
      >
        <p className="text-xs text-[#6b6560] mb-2">
          {showSuccess ? "✓ Wrapped successfully!" : "Try: wrap with quotes"}
        </p>
        <div className="flex items-center gap-2">
          <span 
            className="key-physical transition-all"
            style={{
              background: showSuccess ? '#7a9e7e' : undefined,
              color: showSuccess ? 'white' : undefined,
              borderColor: showSuccess ? '#7a9e7e' : undefined
            }}
          >
            ms"
          </span>
          <span className="text-[#6b6560]">→</span>
          <span className="text-[#7a9e7e] font-mono">
            {showSuccess ? '"name" ✓' : '"name"'}
          </span>
        </div>
      </div>
    </div>
  );
}
