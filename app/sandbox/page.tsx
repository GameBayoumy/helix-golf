'use client';

import { useState, useCallback } from 'react';
import HelixEditor from '@/components/HelixEditor';
import { 
  Code2, 
  Eraser, 
  RotateCcw, 
  Terminal,
  Undo,
  Redo,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

const quickRef = [
  { keys: 'Esc', desc: 'Normal mode' },
  { keys: 'i', desc: 'Insert mode' },
  { keys: 'v', desc: 'Select mode' },
  { keys: 'hjkl', desc: 'Movement' },
  { keys: 'w b e', desc: 'Word nav' },
  { keys: 'x', desc: 'Select line' },
  { keys: 'mi( ma[', desc: 'Inside/around' },
  { keys: 'd', desc: 'Delete' },
  { keys: 'c', desc: 'Change' },
  { keys: 'ms"', desc: 'Surround' },
  { keys: 'u', desc: 'Undo' },
  { keys: 'U', desc: 'Redo' },
];

export default function SandboxPage() {
  const [content, setContent] = useState(
    `// Welcome to Helix Dojo Sandbox!
// Practice Helix commands freely here.
// 
// Try some commands:
//   - hjkl for movement
//   - x to select lines  
//   - mi( to select inside parentheses
//   - ms" to surround with quotes
//   - v for visual mode
//   - i to insert
//   - Esc to return to normal mode

function greet(name) {
    return "Hello, " + name;
}

const result = greet("World");`
  );
  
  const [keystrokes, setKeystrokes] = useState(0);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleKeystroke = useCallback(() => {
    setKeystrokes(prev => prev + 1);
  }, []);

  const handleReset = () => {
    setContent('');
    setKeystrokes(0);
  };

  const handleClear = () => {
    setContent('');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="border-b border-[#e8e3db] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-[#6b6560] hover:text-[#2d2a26] transition-colors"
              >
                <ChevronLeft size={18} />
                <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>Back</span>
              </Link>
              
              <div className="h-6 w-px bg-[#e8e3db]" />
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2d2a26] rounded-lg">
                  <Terminal className="text-[#7a9e7e]" size={18} />
                </div>
                <div>
                  <h1 className="font-semibold text-[#2d2a26]">Sandbox</h1>
                  <p className="text-sm text-[#6b6560]">Practice freely</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#6b6560] border border-[#e8e3db] rounded-lg hover:border-[#2d2a26] transition-colors"
              >
                <Eraser size={14} />
                Clear
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#6b6560] border border-[#e8e3db] rounded-lg hover:border-[#2d2a26] transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#e8e3db] rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-[#f5f0e8] border-b border-[#e8e3db] flex items-center justify-between">
                <span className="text-sm text-[#6b6560]" style={{ fontFamily: 'var(--font-mono)' }}>
                  sandbox.js
                </span>
                <div className="flex items-center gap-4 text-xs text-[#9a948e]">
                  <span className="flex items-center gap-1">
                    <Code2 size={12} />
                    {content.length} chars
                  </span>
                  <span className="flex items-center gap-1">
                    {content.split('\n').length} lines
                  </span>
                </div>
              </div>
              
              <div className="h-[600px]">
                <HelixEditor
                  initialContent={content}
                  targetContent=""
                  onContentChange={handleContentChange}
                  onKeystroke={handleKeystroke}
                  readOnly={false}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-white border border-[#e8e3db] rounded-lg p-4">
              <h3 className="font-semibold text-[#2d2a26] mb-4">Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6560]">Keystrokes</span>
                  <span className="font-mono font-semibold">{keystrokes}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6560]">Characters</span>
                  <span className="font-mono">{content.length}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6560]">Lines</span>
                  <span className="font-mono">{content.split('\n').length}</span>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-white border border-[#e8e3db] rounded-lg p-4">
              <h3 className="font-semibold text-[#2d2a26] mb-4">Quick Reference</h3>
              
              <div className="space-y-2">
                {quickRef.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm"
                  >
                    <code className="px-2 py-0.5 bg-[#f5f0e8] rounded text-[#c4705a] font-mono text-xs">
                      {item.keys}
                    </code>
                    <span className="text-[#6b6560] text-xs">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
