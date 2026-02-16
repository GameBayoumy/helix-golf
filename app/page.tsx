"use client"
import { challenges } from '@/challenges';
import { getDifficultyColor, getCategoryColor } from '@/lib/validator';
import { 
  Code2, 
  Trophy, 
  Target, 
  Clock, 
  ChevronRight,
  Keyboard,
  GitBranch,
  Zap,
  Layers,
  Terminal,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const categories = [
    { id: 'movement', name: 'Movement', icon: <Target size={18} />, count: challenges.filter(c => c.category === 'movement').length },
    { id: 'selection', name: 'Selection', icon: <Zap size={18} />, count: challenges.filter(c => c.category === 'selection').length },
    { id: 'change', name: 'Changes', icon: <GitBranch size={18} />, count: challenges.filter(c => c.category === 'change').length },
    { id: 'surround', name: 'Surround', icon: <Terminal size={18} />, count: challenges.filter(c => c.category === 'surround').length },
    { id: 'multicursor', name: 'Multi-cursor', icon: <Layers size={18} />, count: challenges.filter(c => c.category === 'multicursor').length },
  ];

  const stats = {
    total: challenges.length,
    easy: challenges.filter(c => c.difficulty === 'easy').length,
    medium: challenges.filter(c => c.difficulty === 'medium').length,
    hard: challenges.filter(c => c.difficulty === 'hard').length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-400">{stats.total} challenges available</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                HelixGolf
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Master the <span className="text-slate-200 font-semibold">Helix Editor</span> through interactive challenges. 
              Practice selection-based editing, multiple cursors, and efficient text manipulation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/challenge/${challenges[0].id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25"
                >
                  <Target size={20} />
                  Start First Challenge
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              
              <Link href="#challenges">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-slate-200"
                >
                  <Keyboard size={20} />
                  Browse Challenges
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard 
              icon={<Target className="text-blue-400" />} 
              value={stats.total} 
              label="Total Challenges" 
            />
            <StatCard 
              icon={<div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30" />} 
              value={stats.easy} 
              label="Easy" 
            />
            <StatCard 
              icon={<div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/30" />} 
              value={stats.medium} 
              label="Medium" 
            />
            <StatCard 
              icon={<div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30" />} 
              value={stats.hard} 
              label="Hard" 
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`#${category.id}`}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-slate-700 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                      {category.icon}
                    </div>
                    <span className="text-lg font-semibold text-slate-200">
                      {category.name}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    {category.count} challenges
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges List */}
      <section id="challenges" className="py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">All Challenges</h2>
          
          <div className="grid gap-4">
            {challenges.map((challenge, index) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="text-blue-400" size={24} />
              <span className="font-bold text-white">HelixGolf</span>
            </div>
            
            <div className="text-sm text-slate-500">
              Practice Helix Editor movements and become a power user
            </div>
            
            <a 
              href="https://helix-editor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Learn more about Helix →
            </a>
          </div>        
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl">
      <div className="p-3 bg-slate-800 rounded-lg">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, index }: { challenge: typeof challenges[0]; index: number }) {
  return (
    <Link href={`/challenge/${challenge.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        className="group flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 hover:bg-slate-800 transition-all"
      >
        <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 font-mono text-sm">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-white truncate">{challenge.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>
          
          <p className="text-sm text-slate-400 truncate">{challenge.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="hidden sm:flex items-center gap-1">
            <Keyboard size={14} />
            <span>~{challenge.optimalKeystrokes}</span>
          </div>
          
          <div className={getCategoryColor(challenge.category)}>
            {challenge.category}
          </div>
          
          <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
        </div>
      </motion.div>
    </Link>
  );
}
