'use client';

import { 
  Move, 
  Target, 
  Scissors, 
  Braces, 
  Layers,
  Keyboard,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    title: 'Movement',
    icon: Move,
    color: '#7a9e7e',
    description: 'Navigate efficiently through your code',
    commands: [
      { key: 'h j k l', desc: 'Left, down, up, right' },
      { key: 'w b e', desc: 'Word navigation' },
      { key: 'W B E', desc: 'WORD (space-separated)' },
      { key: 'f t', desc: 'Find/till character' },
      { key: 'gg G', desc: 'First/last line' },
    ]
  },
  {
    title: 'Selection',
    icon: Target,
    color: '#a855f7',
    description: 'Select text - the core of Helix',
    commands: [
      { key: 'x', desc: 'Select line' },
      { key: 'v V', desc: 'Select mode' },
      { key: ';', desc: 'Collapse to cursor' },
      { key: '%', desc: 'Select entire file' },
    ]
  },
  {
    title: 'Changes',
    icon: Scissors,
    color: '#c4705a',
    description: 'Edit with minimal keystrokes',
    commands: [
      { key: 'i a', desc: 'Insert before/after' },
      { key: 'd', desc: 'Delete selection' },
      { key: 'c', desc: 'Change (delete + insert)' },
      { key: 'y p P', desc: 'Yank/paste' },
      { key: 'r', desc: 'Replace character' },
    ]
  },
  {
    title: 'Surround',
    icon: Braces,
    color: '#d4a574',
    description: 'Work with brackets and quotes',
    commands: [
      { key: 'm', desc: 'Match mode' },
      { key: 'mi( ma(', desc: 'Inside/around parens' },
      { key: 'ms"', desc: 'Add surround' },
      { key: 'md"', desc: 'Delete surround' },
    ]
  },
  {
    title: 'Multi-cursor',
    icon: Layers,
    color: '#22d3ee',
    description: 'Edit multiple locations at once',
    commands: [
      { key: 'C', desc: 'Copy to next line' },
      { key: 's', desc: 'Split by regex' },
      { key: ',', desc: 'Keep primary selection' },
    ]
  },
];

const tips = [
  {
    icon: CheckCircle2,
    color: '#7a9e7e',
    title: 'Always know your mode',
    description: 'Watch the mode indicator. Press Escape to return to normal mode.',
  },
  {
    icon: Target,
    color: '#a855f7',
    title: 'Think in selections',
    description: 'Before any command, ask: what should I select first?',
  },
  {
    icon: Keyboard,
    color: '#c4705a',
    title: 'Use counts',
    description: 'Prefix with numbers: 3w jumps 3 words, 5x selects 5 lines.',
  },
  {
    icon: Layers,
    color: '#22d3ee',
    title: 'Multiple cursors',
    description: 'Use C to create multiple cursors, edit them all at once.',
  },
];

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="border-b border-[#e8e3db] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#6b6560] hover:text-[#2d2a26] mb-6 transition-colors"
          >
            <ChevronLeft size={18} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>Back</span>
          </Link>
          
          <h1 
            className="text-4xl font-bold text-[#2d2a26] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Helix Tutorial
          </h1>
          
          <p 
            className="text-lg text-[#6b6560] max-w-2xl"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Learn the fundamentals. Helix is a 
            <strong className="text-[#2d2a26]">selection-based</strong> editor: 
            you <em>select</em>, then you <em>act</em>.
          </p>
        </div>
      </header>

      {/* Core Concept */}
      <section className="py-12 bg-[#f5f0e8]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-start gap-4 p-6 bg-white border border-[#d4a574]/30 rounded-xl">
            <div className="p-3 bg-[#d4a574]/10 rounded-lg">
              <Lightbulb className="text-[#d4a574]" size={24} />
            </div>
            <div>
              <h2 
                className="text-lg font-semibold text-[#2d2a26] mb-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Key Concept: Selection-First
              </h2>
              
              <p className="text-[#6b6560]">
                In Helix, you always select text <em>before</em> performing an action. 
                To delete a word: <code className="px-2 py-0.5 bg-[#f5f0e8] rounded text-[#c4705a] font-mono text-sm">wd</code> 
                (select word, then delete), not <code className="px-2 py-0.5 bg-[#f5f0e8] rounded font-mono text-sm">dw</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Command Reference */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 
            className="text-2xl font-bold text-[#2d2a26] mb-8"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Command Reference
          </h2>
          
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div 
                  key={section.title}
                  className="bg-white border border-[#e8e3db] rounded-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-[#e8e3db] bg-[#faf8f5]">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${section.color}15` }}
                      >
                        <Icon size={20} style={{ color: section.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2d2a26]">{section.title}</h3>
                        <p className="text-sm text-[#6b6560]">{section.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-[#f5f0e8]">
                    {section.commands.map((cmd) => (
                      <div 
                        key={cmd.key}
                        className="flex items-center gap-4 p-4 hover:bg-[#faf8f5] transition-colors"
                      >
                        <code 
                          className="flex-shrink-0 px-3 py-1.5 bg-[#f5f0e8] rounded-lg font-mono text-sm text-[#2d2a26]"
                        >
                          {cmd.key}
                        </code>
                        <span className="text-[#6b6560]">{cmd.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 bg-[#f5f0e8]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 
            className="text-2xl font-bold text-[#2d2a26] mb-8"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Pro Tips
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div 
                  key={tip.title}
                  className="flex items-start gap-4 p-4 bg-white border border-[#e8e3db] rounded-xl"
                >
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${tip.color}15` }}
                  >
                    <Icon size={20} style={{ color: tip.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2d2a26] mb-1">{tip.title}</h3>
                    <p className="text-sm text-[#6b6560]">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-2xl font-bold text-[#2d2a26] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Ready to practice?
          </h2>
          
          <p className="text-[#6b6560] mb-8">Put your knowledge to the test with interactive challenges.</p>
          
          <Link 
            href="/challenge/basic-hjkl"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2d2a26] text-white rounded-lg font-semibold hover:bg-[#4a4540] transition-colors"
          >
            Start First Challenge
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
