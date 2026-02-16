"use client"
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Challenge, ChallengeResult, Keystroke } from '@/types/challenge';
import { challenges, getChallengeById } from '@/challenges';
import { validateChallenge } from '@/lib/validator';
import HelixEditor from '@/components/HelixEditor';
import ChallengePanel from '@/components/ChallengePanel';
import HintSystem from '@/components/HintSystem';
import { 
  ArrowLeft, 
  Code2, 
  Target,
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

  useEffect(() => {
    const ch = getChallengeById(challengeId);
    if (ch) {
      setChallenge(ch);
      setCurrentContent(ch.initial);
      setKeystrokes([]);
      setStartTime(Date.now());
      setHintsUsed(0);
      setResult(null);
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
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Challenge not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                </motion.div>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Code2 className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-white">{challenge.name}</h1>
                  <p className="text-sm text-slate-400">{challenge.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTarget(!showTarget)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showTarget 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Target size={16} />
                {showTarget ? 'Hide Target' : 'Show Target'}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Current Editor */}
            <div className="h-[400px]">
              <HelixEditor
                initialContent={challenge.initial}
                targetContent={challenge.target}
                onContentChange={handleContentChange}
                onKeystroke={handleKeystroke}
                readOnly={false}
              />
            </div>

            {/* Target Preview */}
            <motion.div
              initial={false}
              animate={{ 
                height: showTarget ? 'auto' : 0,
                opacity: showTarget ? 1 : 0
              }}
              className="overflow-hidden"
            >
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
                  <span className="text-sm font-medium text-slate-400">Target</span>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-sm overflow-auto">
                  {challenge.target}
                </pre>
              </div>
            </motion.div>

            {/* Hint System */}
            <HintSystem
              hints={challenge.hints}
              hintsUsed={hintsUsed}
              onUseHint={handleUseHint}
              showAll={false}
            />
          </div>

          {/* Sidebar */}
          <div>
            <ChallengePanel
              challenge={challenge}
              keystrokes={keystrokes.length}
              startTime={startTime}
              hintsUsed={hintsUsed}
              result={result}
              onReset={handleReset}
              onNext={handleNext}
              onUseHint={handleUseHint}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
