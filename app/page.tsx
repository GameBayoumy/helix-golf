'use client';

import { challenges } from '@/challenges';
import Link from 'next/link';
import InteractiveHeroDemo from '@/app/components/InteractiveHeroDemo';
import { 
  Terminal, 
  Keyboard, 
  Target, 
  Zap, 
  ArrowRight,
  Layers,
  GitBranch,
  BookOpen
} from 'lucide-react';

const categories = [
  { id: 'movement', name: 'Movement', icon: Target, desc: 'Navigate with precision' },
  { id: 'selection', name: 'Selection', icon: Layers, desc: 'Select with intent' },
  { id: 'change', name: 'Change', icon: Zap, desc: 'Transform efficiently' },
  { id: 'surround', name: 'Surround', icon: Terminal, desc: 'Master delimiters' },
  { id: 'multicursor', name: 'Multi', icon: GitBranch, desc: 'Edit in parallel' },
];

export default function LandingPage() {
  const firstChallenge = challenges[0];
  
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-[#e8e3db] bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#2d2a26]" style={{ fontFamily: 'var(--font-serif)' }}>
              helix
            </span>
            <span className="text-lg text-[#c4705a] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
              dojo
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/tutorial" className="text-sm text-[#6b6560] hover:text-[#2d2a26] transition-colors">
              Tutorial
            </Link>
            <Link href="/sandbox" className="text-sm text-[#6b6560] hover:text-[#2d2a26] transition-colors">
              Sandbox
            </Link>
            <a 
              href="https://helix-editor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#6b6560] hover:text-[#2d2a26] transition-colors"
            >
              Documentation ↗
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetric */}
      <section className="pt-16 pb-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column - Text */}
            <div className="lg:col-span-5 lg:pt-12">
              <div className="flex items-center gap-2 text-sm text-[#c4705a] mb-6">
                <span className="w-8 h-[2px] bg-[#c4705a]" />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{challenges.length} curated challenges</span>
              </div>
              
              <h1 
                className="text-5xl lg:text-6xl font-bold text-[#2d2a26] mb-6 leading-[1.1]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                The Art of
                <br />
                <span className="accent-underline">Text Editing</span>
              </h1>
              
              <p 
                className="text-lg text-[#6b6560] mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Helix is a modal editor built on a simple idea: 
                <strong className="text-[#2d2a26]">select, then act</strong>. 
                No Vim legacy. No Emacs chords. Just you and your text.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href={`/challenge/${firstChallenge.id}`} className="btn-primary">
                  <Keyboard className="w-4 h-4" />
                  Start Training
                </Link>
                
                <Link href="/sandbox" className="btn-secondary">
                  <Terminal className="w-4 h-4" />
                  Free Play
                </Link>
              </div>
            </div>

            {/* Right Column - Interactive Demo */}
            <div className="lg:col-span-7 relative">
              <div className="grid-decoration absolute inset-0 opacity-50" />
              
              <div className="relative z-10">
                <InteractiveHeroDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Horizontal Cards */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm text-[#c4705a] mb-2 block" style={{ fontFamily: 'var(--font-mono)' }}>
                01 — The Path
              </span>
              <h2 
                className="text-3xl font-bold text-[#2d2a26]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Five Disciplines
              </h2>
            </div>
            <Link 
              href="/sandbox"
              className="text-sm text-[#6b6560] hover:text-[#2d2a26] transition-colors flex items-center gap-1"
            >
              View All Challenges <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const count = challenges.filter(c => c.category === cat.id).length;
              
              return (
                <Link
                  key={cat.id}
                  href={`/sandbox?category=${cat.id}`}
                  className="group card-editorial p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="text-4xl font-bold text-[#e8e3db] group-hover:text-[#c4705a] transition-colors"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Icon className="w-5 h-5 text-[#6b6560] group-hover:text-[#c4705a] transition-colors" />
                  </div>
                  
                  <h3 
                    className="font-semibold text-[#2d2a26] mb-1"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {cat.name}
                  </h3>
                  
                  <p className="text-sm text-[#6b6560] mb-4">{cat.desc}</p>
                  
                  <div className="mt-auto pt-4 border-t border-[#e8e3db]">
                    <span className="text-xs text-[#9a948e]">{count} exercises</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm text-[#c4705a] mb-2 block" style={{ fontFamily: 'var(--font-mono)' }}>
              02 — Practice
            </span>            
            <h2 
              className="text-3xl font-bold text-[#2d2a26] mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Begin with the Fundamentals
            </h2>
            
            <p className="text-[#6b6560]" style={{ fontFamily: 'var(--font-sans)' }}>
              Master these core concepts before advancing to complex multi-step transformations.
            </p>
          </div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {challenges.slice(0, 5).map((challenge, i) => (
              <Link
                key={challenge.id}
                href={`/challenge/${challenge.id}`}
                className="group flex items-center gap-6 p-6 bg-white border border-[#e8e3db] rounded-lg hover:border-[#c4705a] transition-all"
              >
                <span 
                  className="text-2xl font-bold text-[#e8e3db] group-hover:text-[#c4705a] transition-colors w-12"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 
                      className="font-semibold text-[#2d2a26]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {challenge.name}
                    </h4>
                    
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: challenge.difficulty === 'easy' ? '#f0ebe4' : '#e8e3db',
                        color: '#6b6560'
                      }}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-[#6b6560]">{challenge.description}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-[#9a948e]">
                  <span>~{challenge.optimalKeystrokes} keys</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-[#2d2a26] text-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-6 text-[#c4705a]" />
          
          <blockquote 
            className="text-2xl lg:text-3xl font-medium leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            "Helix is not Vim. It is not Emacs. It is a 
            <span className="text-[#c4705a]">selection-first</span> editor 
            built on the principle that you should know what you're changing 
            <em>before</em> you change it."
          </blockquote>
          
          
          <a 
            href="https://helix-editor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#c4705a] hover:text-[#d48a76] transition-colors"
          >
            Read the Helix Philosophy
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#e8e3db]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[#2d2a26]" style={{ fontFamily: 'var(--font-serif)' }}>helix</span>
              <span className="text-[#c4705a]" style={{ fontFamily: 'var(--font-mono)' }}>dojo</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#6b6560]">
              <a href="/terms" className="hover:text-[#2d2a26] transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-[#2d2a26] transition-colors">Privacy</a>
              <a href="https://github.com/helix-editor/helix" target="_blank" className="hover:text-[#2d2a26] transition-colors">Helix on GitHub</a>
            </div>
          </div>
          
          
          <p className="text-center text-xs text-[#9a948e] mt-8">
            An unofficial training tool. Not affiliated with the Helix Editor project.
          </p>
        </div>
      </footer>
    </div>
  );
}
