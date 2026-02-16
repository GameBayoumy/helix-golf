'use client';

import { challenges } from '@/challenges';
import Link from 'next/link';
import { 
  Terminal, 
  Keyboard, 
  Target, 
  Zap, 
  ChevronRight,
  Command,
  Layers,
  GitBranch
} from 'lucide-react';

const categories = [
  { id: 'movement', name: 'Movement', icon: Target, color: '#ff6b6b', count: 0 },
  { id: 'selection', name: 'Selection', icon: Layers, color: '#4ecdc4', count: 0 },
  { id: 'change', name: 'Change', icon: Zap, color: '#ffb347', count: 0 },
  { id: 'surround', name: 'Surround', icon: Command, color: '#a855f7', count: 0 },
  { id: 'multicursor', name: 'Multi-cursor', icon: GitBranch, color: '#22d3ee', count: 0 },
];

// Count challenges per category
categories.forEach(cat => {
  cat.count = challenges.filter(c => c.category === cat.id).length;
});

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="border-b border-[#2a2a3a] bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">helix<span className="text-[#ff6b6b]">dojo</span></h1>
              <p className="text-xs text-[#6b6b7b]">Master the selection-first editor</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tutorial" className="text-sm text-[#6b6b7b] hover:text-white transition-colors">Tutorial</Link>
            <Link href="/sandbox" className="text-sm text-[#6b6b7b] hover:text-white transition-colors">Sandbox</Link>
            <a 
              href="https://helix-editor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#6b6b7b] hover:text-white transition-colors"
            >
              Helix Docs ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#ff6b6b] animate-pulse" />
                <span className="text-sm text-[#ff6b6b]">{challenges.length} Challenges Available</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Think in <span className="text-[#ff6b6b]">selections</span>.
                <br />
                Edit with <span className="text-[#4ecdc4]">precision</span>.
              </h2>
              
              <p className="text-lg text-[#6b6b7b] mb-8 leading-relaxed max-w-lg">
                Helix is a modal editor with a twist: multiple selections, context-aware commands, 
                and a consistent grammar. Master it through hands-on challenges.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/challenge/${challenges[0].id}`}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-[#ff6b6b]/25 transition-all"
                >
                  <Keyboard className="w-5 h-5" />
                  Start Training
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/sandbox"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#2a2a3a] rounded-lg font-semibold text-white hover:bg-[#1a1a25] transition-colors"
                >
                  <Terminal className="w-5 h-5" />
                  Open Sandbox
                </Link>
              </div>
            </div>
            
            {/* Hero Visual - Code Demo */}
            <div className="relative">
              <div className="terminal-window glow-coral">
                <div className="terminal-header">
                  <div className="flex gap-2">
                    <div className="terminal-dot red" />
                    <div className="terminal-dot yellow" />
                    <div className="terminal-dot green" />
                  </div>
                  <span className="text-sm text-[#6b6b7b] ml-4">challenge_01.txt</span>
                </div>
                
                <div className="p-6 font-mono text-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#6b6b7b]">NORMAL</span>
                    <span className="text-[#4ecdc4]">mi(</span>
                    <span className="text-[#6b6b7b]">— Select inside parentheses</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="text-[#6b6b7b] w-8">1</span>
                      <span className="text-[#6b6b7b]">function </span>
                      <span className="text-[#ffb347]">greet</span>
                      <span className="text-white">(</span>
                      <span className="bg-[#ff6b6b]/30 text-white px-1">name</span>
                      <span className="text-white">)</span>
                      <span className="text-white"></span>
                      <span className="text-white"></span>
                    </div>
                    <div className="flex">
                      <span className="text-[#6b6b7b] w-8">2</span>
                      <span className="text-[#6b6b7b] ml-4">return </span>
                      <span className="text-[#4ecdc4]">"Hello"</span>
                    </div>
                    <div className="flex">
                      <span className="text-[#6b6b7b] w-8">3</span>
                      <span className="text-white">&rbrace;</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#2a2a3a] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#6b6b7b]">Selected: 4 chars</span>
                      <span className="text-xs text-[#6b6b7b]">1 selection</span>
                    </div>
                    <span className="text-xs text-[#ff6b6b]">● REC</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Key Hint */}
              <div className="absolute -bottom-4 -right-4 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg p-4 shadow-xl">
                <p className="text-xs text-[#6b6b7b] mb-2">Next: Wrap with quotes</p>
                <div className="flex items-center gap-2">
                  <span className="keycap">ms"</span>
                  <span className="text-[#6b6b7b]">→</span>
                  <span className="text-[#4ecdc4]">"name"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#2a2a3a] bg-[#12121a]/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: challenges.length, label: 'Challenges', color: '#ff6b6b' },
              { value: '5', label: 'Categories', color: '#4ecdc4' },
              { value: '∞', label: 'Sandboxes', color: '#ffb347' },
              { value: '0', label: 'Your Progress', color: '#a855f7' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-[#6b6b7b]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Challenge Categories</h3>
            <Link 
              href="/sandbox"
              className="text-sm text-[#6b6b7b] hover:text-white transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/sandbox?category=${cat.id}`}
                  className="group p-6 rounded-xl border border-[#2a2a3a] bg-[#12121a] hover:border-opacity-50 transition-all hover:scale-[1.02]"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  
                  <h4 className="font-semibold mb-1 group-hover:text-white transition-colors">
                    {cat.name}
                  </h4>
                  
                  <p className="text-sm text-[#6b6b7b]">{cat.count} challenges</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-20 border-t border-[#2a2a3a]">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold mb-8">Start Here</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {challenges.slice(0, 6).map((challenge, i) => (
              <Link
                key={challenge.id}
                href={`/challenge/${challenge.id}`}
                className="group p-6 rounded-xl border border-[#2a2a3a] bg-[#12121a] hover:bg-[#1a1a25] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#2a2a3a] group-hover:text-[#ff6b6b] transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: challenge.difficulty === 'easy' ? '#22c55e20' : challenge.difficulty === 'medium' ? '#f59e0b20' : '#ef444420',
                        color: challenge.difficulty === 'easy' ? '#4ade80' : challenge.difficulty === 'medium' ? '#fbbf24' : '#f87171'
                      }}
                    >
                      {challenge.difficulty}
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-[#2a2a3a] group-hover:text-white transition-colors" />
                </div>
                
                <h4 className="font-semibold mb-2 group-hover:text-white transition-colors">{challenge.name}</h4>
                
                <p className="text-sm text-[#6b6b7b] line-clamp-2">{challenge.description}</p>
                
                <div className="mt-4 pt-4 border-t border-[#2a2a3a] flex items-center gap-2">
                  <span className="text-xs text-[#6b6b7b]">Optimal: {challenge.optimalKeystrokes} keystrokes</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a3a] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">helix<span className="text-[#ff6b6b]">dojo</span></span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#6b6b7b]">
              <a href="https://helix-editor.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Helix Editor
              </a>
              <a href="https://github.com/helix-editor/helix" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
          
          <p className="text-center text-xs text-[#6b6b7b] mt-8">
            Not affiliated with Helix Editor. Built for practice.
          </p>
        </div>
      </footer>
    </div>
  );
}