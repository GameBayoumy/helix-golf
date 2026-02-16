'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Challenge, ChallengeResult } from '@/types/challenge';
import { 
  Trophy, 
  Target, 
  Clock, 
  Keyboard, 
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  Star,
  AlertCircle
} from 'lucide-react';
import { getDifficultyColor, calculateScore, getStarRating } from '@/lib/validator';

interface ChallengePanelProps {
  challenge: Challenge;
  keystrokes: number;
  startTime: number;
  hintsUsed: number;
  result: ChallengeResult | null;
  onReset: () => void;
  onNext: () => void;
  onUseHint: () => void;
}

export default function ChallengePanel({
  challenge,
  keystrokes,
  startTime,
  hintsUsed,
  result,
  onReset,
  onNext,
  onUseHint,
}: ChallengePanelProps) {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const score = result ? calculateScore(
    result.keystrokes,
    result.optimalKeystrokes,
    result.hintsUsed,
    result.timeMs
  ) : 0;
  const stars = result ? getStarRating(
    result.keystrokes,
    result.optimalKeystrokes,
    result.hintsUsed
  ) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 flex flex-col gap-4"
    >
      {/* Challenge Info Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="text-xs text-slate-500 capitalize">
              {challenge.category}
            </span>
          </div>
          
          <h2 className="text-lg font-bold text-white mb-2">
            {challenge.name}
          </h2>
          
          <p className="text-sm text-slate-400">
            {challenge.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-slate-700">
          <StatItem 
            icon={<Keyboard size={16} />} 
            label="Keystrokes" 
            value={keystrokes.toString()}
            subValue={`optimal: ${challenge.optimalKeystrokes}`}
            color={keystrokes <= challenge.optimalKeystrokes ? 'text-green-400' : 'text-yellow-400'}
          />
          <StatItem 
            icon={<Clock size={16} />} 
            label="Time" 
            value={`${elapsed}s`}
            color="text-blue-400"
          />
          
          <StatItem 
            icon={<Lightbulb size={16} />} 
            label="Hints" 
            value={`${hintsUsed}/${challenge.hints.length}`}
            color={hintsUsed === 0 ? 'text-green-400' : hintsUsed <= 1 ? 'text-yellow-400' : 'text-red-400'}
          />
          
          <StatItem 
            icon={<Target size={16} />} 
            label="Category" 
            value={challenge.category}
            color="text-purple-400"
          />
        </div>
      </div>

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`rounded-xl border p-4 ${
              result.completed 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {result.completed ? (
                <>
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <Trophy className="text-green-400" size={24} />
                  </div>
                  <div>
                    <div className="text-green-400 font-bold">Challenge Complete!</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(3)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} 
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <XCircle className="text-red-400" size={24} />
                  </div>
                  <div>
                    <div className="text-red-400 font-bold">Try Again</div>
                    <div className="text-sm text-red-400/70">Match the target exactly</div>
                  </div>
                </>
              )}
            </div>

            {result.completed && (
              <div className="text-2xl font-bold text-white mb-3">
                {score} pts
              </div>
            )}

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                <RotateCcw size={16} />
                Reset
              </motion.button>
              
              {result.completed && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNext}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {!result && (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUseHint}
            disabled={hintsUsed >= challenge.hints.length}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-yellow-400 transition-colors"
          >
            <Lightbulb size={16} />
            Hint
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function StatItem({ 
  icon, 
  label, 
  value, 
  subValue,
  color = 'text-slate-400'
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  subValue?: string;
  color?: string;
}) {
  return (
    <div className="bg-slate-800 p-3">
      <div className={`flex items-center gap-2 mb-1 ${color}`}>
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      {subValue && (
        <div className="text-xs text-slate-500">{subValue}</div>
      )}
    </div>
  );
}
