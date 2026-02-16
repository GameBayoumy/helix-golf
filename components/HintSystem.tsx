'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, AlertCircle } from 'lucide-react';

interface HintSystemProps {
  hints: string[];
  hintsUsed: number;
  onUseHint: () => void;
  showAll?: boolean;
}

export default function HintSystem({ hints, hintsUsed, onUseHint, showAll = false }: HintSystemProps) {
  const visibleHints = showAll ? hints : hints.slice(0, hintsUsed);
  const hasMoreHints = hintsUsed < hints.length;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-yellow-400" size={18} />
          <span className="font-semibold text-white">Hints</span>
        </div>
        <span className="text-xs text-slate-500">
          {hintsUsed}/{hints.length} used
        </span>
      </div>

      <div className="p-4">
        <AnimatePresence mode="popLayout">
          {visibleHints.map((hint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 mb-3 last:mb-0"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-400">{index + 1}</span>
              </div>
              <p className="text-sm text-slate-300">{hint}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {visibleHints.length === 0 && !showAll && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <AlertCircle size={16} />
            <span>No hints used yet. Try the challenge first!</span>
          </div>
        )}

        {hasMoreHints && !showAll && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUseHint}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg text-sm font-medium text-yellow-400 transition-colors"
          >
            <Lightbulb size={16} />
            Show Next Hint
            <ChevronRight size={16} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
