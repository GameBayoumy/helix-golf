'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Challenge, ChallengeResult, Keystroke } from '@/types/challenge';
import { challenges, getChallengeById } from '@/challenges';
import { validateChallenge } from '@/lib/validator';
import HelixEditor from '@/components/HelixEditor';
import { 
  ArrowLeft, 
  Code2, 
  Target,
  RotateCcw,
  ChevronRight,
  Check,
  Clock,
  Keyboard,
  Lightbulb,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

interface ChallengePageClientProps {
  challengeId: string;
}

export default function ChallengePageClient({ challengeId }: ChallengePageClientProps) {
  const router = useRouter();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [showTarget, setShowTarget] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    console.log('Looking for challenge:', challengeId);
    console.log('Available challenges:', challenges.map(c => c.id));
    const ch = getChallengeById(challengeId);
    console.log('Found challenge:', ch);
    if (ch) {
      setChallenge(ch);
      setCurrentContent(ch.initial);
      setKeystrokes([]);
      setStartTime(Date.now());
      setHintsUsed(0);
      setResult(null);
      setShowHint(false);
    }
  }, [challengeId]);

  const handleContentChange = useCallback((content: string) => {
    setCurrentContent(content);
    
    // Check if challenge is complete
    if (challenge && validateChallenge(challenge.initial, challenge.target, content)) {
      if (!result) {
        setResult({
          completed: true,
          keystrokes: keystrokes.length,
          optimalKeystrokes: challenge.optimalKeystrokes,
          timeMs: Date.now() - startTime,
          hintsUsed,
        });
      }
    }
  }, [challenge, keystrokes.length, startTime, hintsUsed, result]);

  const handleKeystroke = useCallback((key: string) => {
    setKeystrokes(prev => [...prev, { key, timestamp: Date.now() }]);
  }, []);

  const handleReset = () => {
    if (challenge) {
      setCurrentContent(challenge.initial);
      setKeystrokes([]);
      setStartTime(Date.now());
      setHintsUsed(0);
      setResult(null);
      setShowHint(false);
    }
  };

  const handleNext = () => {
    const currentIndex = challenges.findIndex(c => c.id === challengeId);
    if (currentIndex < challenges.length - 1) {
      router.push(`/challenge/${challenges[currentIndex + 1].id}`);
    } else {
      router.push('/');
    }
  };

  const handleUseHint = () => {
    if (challenge && hintsUsed < challenge.hints.length) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-[#7a9e7e]/20 text-[#7a9e7e]';
      case 'medium': return 'bg-[#d4a574]/20 text-[#d4a574]';
      case 'hard': return 'bg-[#c4705a]/20 text-[#c4705a]';
      default: return 'bg-[#9a948e]/20 text-[#9a948e]';
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#6b6560] mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
            Challenge "{challengeId}" not found
          </div>
          <div className="text-sm text-[#9a948e] mb-4">
            Available: {challenges.slice(0, 5).map(c => c.id).join(', ')}...
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d2a26] text-white rounded-lg"
          >
            <ArrowLeft size={16} />
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

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
                <ArrowLeft size={18} />
                <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>Back</span>
              </Link>
              
              <div className="h-6 w-px bg-[#e8e3db]" />
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2d2a26] rounded-lg">
                  <Code2 className="text-[#faf8f5]" size={18} />
                </div>
                <div>
                  <h1 
                    className="font-semibold text-[#2d2a26]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {challenge.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs text-[#9a948e]">
                      {challenge.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTarget(!showTarget)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  showTarget 
                    ? 'bg-[#2d2a26] text-white border-[#2d2a26]' 
                    : 'bg-white text-[#6b6560] border-[#e8e3db] hover:border-[#2d2a26]'
                }`}
              >
                <Target size={16} />
                {showTarget ? 'Hide Target' : 'Show Target'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Challenge Description */}
            <div className="bg-white border border-[#e8e3db] rounded-lg p-4">
              <p className="text-[#6b6560]">{challenge.description}</p>
            </div>

            {/* Editor */}
            <div className="bg-white border border-[#e8e3db] rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-[#f5f0e8] border-b border-[#e8e3db] flex items-center justify-between">
                <span className="text-sm text-[#6b6560]" style={{ fontFamily: 'var(--font-mono)' }}>
                  editor
                </span>
                <div className="flex items-center gap-4 text-xs text-[#9a948e]">
                  <span className="flex items-center gap-1">
                    <Keyboard size={12} />
                    {keystrokes.length} keystrokes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              <div className="h-[400px]">
                <HelixEditor
                  initialContent={challenge.initial}
                  targetContent={challenge.target}
                  onContentChange={handleContentChange}
                  onKeystroke={handleKeystroke}
                  readOnly={false}
                />
              </div>
            </div>

            {/* Target Preview */}
            {showTarget && (
              <div className="bg-white border border-[#e8e3db] rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-[#7a9e7e]/10 border-b border-[#7a9e7e]/20">
                  <span className="text-sm font-medium text-[#7a9e7e]" style={{ fontFamily: 'var(--font-mono)' }}>
                    Target
                  </span>
                </div>
                <pre 
                  className="p-4 bg-[#faf8f5] text-[#2d2a26] font-mono text-sm overflow-auto"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {challenge.target}
                </pre>
              </div>
            )}

            {/* Hints */}
            {challenge.hints.length > 0 && (
              <div className="bg-white border border-[#e8e3db] rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-[#f5f0e8] border-b border-[#e8e3db] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={16} className="text-[#d4a574]" />
                    <span className="text-sm font-medium text-[#2d2a26]">Hints</span>
                    <span className="text-xs text-[#9a948e]">({hintsUsed}/{challenge.hints.length} used)</span>
                  </div>
                  
                  {hintsUsed < challenge.hints.length && !result && (
                    <button
                      onClick={handleUseHint}
                      className="text-xs px-3 py-1 bg-[#d4a574] text-white rounded hover:bg-[#c4705a] transition-colors"
                    >
                      Reveal Hint
                    </button>
                  )}
                </div>
                
                <div className="p-4 space-y-2">
                  {challenge.hints.slice(0, hintsUsed).map((hint, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[#d4a574] font-mono">{i + 1}.</span>
                      <span className="text-[#6b6560]">{hint}</span>
                    </div>
                  ))}
                  
                  {hintsUsed === 0 && (
                    <p className="text-sm text-[#9a948e] italic">No hints used yet. Click "Reveal Hint" if you need help.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-white border border-[#e8e3db] rounded-lg p-6">
              {result ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#7a9e7e] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-white" />
                  </div>
                  
                  <h3 
                    className="text-xl font-bold text-[#2d2a26] mb-2"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Completed!
                  </h3>
                  
                  <p className="text-[#6b6560] mb-6">Great job mastering this challenge.</p>
                  
                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-[#6b6560]">Your keystrokes:</span>
                      <span className="font-mono font-semibold">{result.keystrokes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b6560]">Optimal:</span>
                      <span className="font-mono text-[#7a9e7e]">{result.optimalKeystrokes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b6560]">Hints used:</span>
                      <span className="font-mono">{result.hintsUsed}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#e8e3db] rounded-lg text-[#6b6560] hover:border-[#2d2a26] transition-colors"
                    >
                      <RotateCcw size={16} />
                      Retry
                    </button>
                    
                    <button
                      onClick={handleNext}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2d2a26] text-white rounded-lg hover:bg-[#4a4540] transition-colors"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy size={24} className="text-[#d4a574]" />
                    <div>
                      <h3 className="font-semibold text-[#2d2a26]">In Progress</h3>
                      <p className="text-sm text-[#6b6560]">Transform the text to match the target.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-[#e8e3db]">
                      <span className="text-[#6b6560]">Keystrokes</span>
                      <span className="font-mono font-semibold">{keystrokes.length}</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-[#e8e3db]">
                      <span className="text-[#6b6560]">Optimal</span>
                      <span className="font-mono text-[#7a9e7e]">{challenge.optimalKeystrokes}</span>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-[#6b6560]">Hints</span>
                      <span className="font-mono">{hintsUsed}/{challenge.hints.length}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleReset}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-[#e8e3db] rounded-lg text-[#6b6560] hover:border-[#2d2a26] transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset Challenge
                  </button>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="bg-white border border-[#e8e3db] rounded-lg p-4">
              <h4 className="font-medium text-[#2d2a26] mb-3">Challenge Progress</h4>
              
              <div className="w-full h-2 bg-[#f5f0e8] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#c4705a] transition-all duration-500"
                  style={{ 
                    width: `${((challenges.findIndex(c => c.id === challengeId) + 1) / challenges.length) * 100}%` 
                  }}
                />
              </div>
              
              <p className="text-xs text-[#9a948e] mt-2">
                {challenges.findIndex(c => c.id === challengeId) + 1} of {challenges.length} challenges
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
