"use client"
'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import HelixEditor from '@/components/HelixEditor';
import { 
  Code2, 
  Eraser, 
  RotateCcw, 
  Save,
  FileCode,
  Terminal
} from 'lucide-react';
import Link from 'next/link';

export default function SandboxPage() {
  const [content, setContent] = useState(
    `// Welcome to HelixGolf Sandbox!
// This is a safe space to practice Helix keybindings.
// Try some commands:
//   - hjkl for movement
//   - x to select lines
//   - v for visual mode
//   - i to insert
//   - Esc to return to normal mode

function example() {
    const message = "Hello, Helix!";
    console.log(message);
    return message;
}`
  );
  const [keystrokes, setKeystrokes] = useState(0);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    // Add to history if different
    if (newContent !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const handleKeystroke = useCallback(() => {
    setKeystrokes(prev => prev + 1);
  }, []);

  const handleReset = () => {
    setContent('');
    setKeystrokes(0);
    setHistory(['']);
    setHistoryIndex(0);
  };

  const handleClear = () => {
    setContent('');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-slate-400 hover:text-white"
              >
                ← Back
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Terminal className="text-green-400" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-white">Sandbox</h1>
                  <p className="text-sm text-slate-400">Practice Helix commands freely</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300"
              >
                Undo
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-300"
              >
                Redo
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              >
                <Eraser size={14} />
                Clear
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              >
                <RotateCcw size={14} />
                Reset
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Editor */}
          <div className="lg:col-span-3">
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

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h3 className="font-semibold text-white mb-4">Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Keystrokes</span>
                  <span className="text-white font-mono">{keystrokes}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Characters</span>
                  <span className="text-white font-mono">{content.length}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Lines</span>
                  <span className="text-white font-mono">{content.split('\n').length}</span>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h3 className="font-semibold text-white mb-4">Quick Reference</h3>
              
              <div className="space-y-2 text-sm">
                <QuickRefItem keys="Esc" desc="Normal mode" />
                <QuickRefItem keys="i" desc="Insert mode" />
                <QuickRefItem keys="v" desc="Select mode" />
                <QuickRefItem keys="hjkl" desc="Movement" />
                <QuickRefItem keys="wbe" desc="Word nav" />
                <QuickRefItem keys="x" desc="Select line" />
                <QuickRefItem keys="d" desc="Delete" />
                <QuickRefItem keys="c" desc="Change" />
                <QuickRefItem keys="u" desc="Undo" />
                <QuickRefItem keys="U" desc="Redo" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickRefItem({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-center justify-between">
      <code className="px-2 py-0.5 bg-slate-700 rounded text-yellow-400 font-mono text-xs">{keys}</code>
      <span className="text-slate-400">{desc}</span>
    </div>
  );
}
