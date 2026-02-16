import { 
  Move, 
  Target, 
  Scissors, 
  Braces, 
  Layers,
  Keyboard,
  Lightbulb,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function TutorialPage() {
  const sections = [
    {
      title: 'Movement',
      icon: <Move className="text-blue-400" size={24} />,
      description: 'Navigate efficiently through your code',
      commands: [
        { key: 'h, j, k, l', desc: 'Move left, down, up, right' },
        { key: 'w, b, e', desc: 'Next word, previous word, word end' },
        { key: 'W, B, E', desc: 'WORD navigation (space-separated)' },
        { key: 'f, t', desc: 'Find/till character' },
        { key: 'gg, G', desc: 'Go to first/last line' },
        { key: '0, $', desc: 'Go to line start/end' },
      ]
    },
    {
      title: 'Selection',
      icon: <Target className="text-purple-400" size={24} />,
      description: 'Select text efficiently - Helix is selection-based',
      commands: [
        { key: 'x', desc: 'Select current line, extend to next' },
        { key: 'X', desc: 'Extend selection to line bounds' },
        { key: 'v', desc: 'Enter select (visual) mode' },
        { key: 'V', desc: 'Enter line-wise select mode' },
        { key: ';', desc: 'Collapse selection to cursor' },
        { key: '%', desc: 'Select entire file' },
      ]
    },
    {
      title: 'Changes',
      icon: <Scissors className="text-orange-400" size={24} />,
      description: 'Edit text with minimal keystrokes',
      commands: [
        { key: 'i, a', desc: 'Insert before/after selection' },
        { key: 'I, A', desc: 'Insert at line start/end' },
        { key: 'o, O', desc: 'Open new line below/above' },
        { key: 'd', desc: 'Delete selection' },
        { key: 'c', desc: 'Change selection (delete + insert)' },
        { key: 'y, p, P', desc: 'Yank, paste after/before' },
        { key: 'r', desc: 'Replace character' },
        { key: '~', desc: 'Switch case' },
        { key: '>, <', desc: 'Indent, unindent' },
        { key: 'J', desc: 'Join lines' },
      ]
    },
    {
      title: 'Surround',
      icon: <Braces className="text-pink-400" size={24} />,
      description: 'Work with brackets, quotes, and delimiters',
      commands: [
        { key: 'm', desc: 'Enter match mode' },
        { key: 'mi(', desc: 'Match inside parentheses' },
        { key: 'ma(', desc: 'Match around parentheses' },
        { key: 'mi[, ma[', desc: 'Match inside/around brackets' },
        { key: 'mi{, ma{', desc: 'Match inside/around braces' },
        { key: 'ms"', desc: 'Add surround (after selecting)' },
        { key: 'mr("', desc: 'Replace surround' },
        { key: 'md"', desc: 'Delete surround' },
      ]
    },
    {
      title: 'Multi-cursor',
      icon: <Layers className="text-cyan-400" size={24} />,
      description: 'Edit multiple locations simultaneously',
      commands: [
        { key: 'C', desc: 'Copy selection to next line (add cursor)' },
        { key: 's', desc: 'Split selection by regex' },
        { key: ',', desc: 'Keep primary selection' },
        { key: 'Alt-,', desc: 'Remove primary selection' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
          >
            ← Back to Challenges
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-4">Helix Tutorial</h1>
          
          <p className="text-lg text-slate-400">
            Learn the fundamentals of Helix Editor. Helix is a 
            <strong className="text-slate-200">selection-based</strong> modal editor 
            inspired by Kakoune. Unlike Vim where you act then select, in Helix you 
            <strong className="text-slate-200">select then act</strong>.
          </p>
        </div>
      </header>

      {/* Core Concept */}
      <section className="py-12 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-4 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Lightbulb className="text-blue-400 flex-shrink-0" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-blue-400 mb-2">Key Concept: Selection-First</h2>
              <p className="text-slate-300">
                In Helix, you always select text <em>before</em> performing an action. 
                This is the opposite of Vim. For example, to delete a word: 
                <code className="px-2 py-1 bg-slate-800 rounded text-yellow-400">wd</code> 
                (select word, then delete), not 
                <code className="px-2 py-1 bg-slate-800 rounded">dw</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Command Reference */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Command Reference</h2>
          
          <div className="space-y-6">
            {sections.map((section) => (
              <div 
                key={section.title}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <div>
                      <h3 className="font-semibold text-white">{section.title}</h3>
                      <p className="text-sm text-slate-400">{section.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-700/50">
                  {section.commands.map((cmd) => (
                    <div 
                      key={cmd.key}
                      className="flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-colors"
                    >
                      <code className="flex-shrink-0 px-3 py-1.5 bg-slate-700 rounded-lg font-mono text-sm text-yellow-400">
                        {cmd.key}
                      </code>
                      <span className="text-slate-300">{cmd.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Pro Tips</h2>
          
          <div className="grid gap-4">
            <TipCard
              icon={<CheckCircle2 className="text-green-400" />}
              title="Always know your mode"
              description="Watch the mode indicator in the status bar. Press Escape to return to normal mode if unsure."
            />
            
            <TipCard
              icon={<Target className="text-purple-400" />}
              title="Think in selections"
              description="Before pressing any command key, ask yourself: what should I select first?"
            />
            
            <TipCard
              icon={<Keyboard className="text-blue-400" />}
              title="Use counts"
              description="Prefix commands with numbers: 3w jumps 3 words, 5x selects 5 lines."
            />
            
            <TipCard
              icon={<Layers className="text-cyan-400" />}
              title="Multiple cursors are powerful"
              description="Use C to create multiple cursors, then edit them all at once."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to practice?</h2>
          
          <p className="text-slate-400 mb-8">
            Put your knowledge to the test with interactive challenges.
          </p>
          
          <Link 
            href="/challenge/basic-hjkl"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition-colors"
          >
            Start First Challenge
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function TipCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
      <div className="p-2 bg-slate-700 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}
