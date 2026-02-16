export function validateChallenge(initial: string, target: string, current: string): boolean {
  // Normalize line endings
  const normalize = (s: string) => s.replace(/\r\n/g, '\n').trim();
  return normalize(current) === normalize(target);
}

export function calculateScore(
  keystrokes: number,
  optimalKeystrokes: number,
  hintsUsed: number,
  timeMs: number
): number {
  // Base score: 1000
  let score = 1000;
  
  // Penalize for keystrokes over optimal (10 points per extra keystroke)
  const keystrokePenalty = Math.max(0, (keystrokes - optimalKeystrokes) * 10);
  score -= keystrokePenalty;
  
  // Penalize for hints used (100 points each)
  score -= hintsUsed * 100;
  
  // Time penalty (1 point per second over 30 seconds)
  const timePenalty = Math.max(0, (timeMs / 1000 - 30));
  score -= timePenalty;
  
  // Minimum score is 0
  return Math.max(0, Math.round(score));
}

export function getStarRating(
  keystrokes: number,
  optimalKeystrokes: number,
  hintsUsed: number
): number {
  if (hintsUsed > 0) return 1;
  if (keystrokes <= optimalKeystrokes) return 3;
  if (keystrokes <= optimalKeystrokes + 3) return 2;
  return 1;
}

export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'hard':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'movement':
      return 'text-blue-400';
    case 'selection':
      return 'text-purple-400';
    case 'change':
      return 'text-orange-400';
    case 'surround':
      return 'text-pink-400';
    case 'multicursor':
      return 'text-cyan-400';
    default:
      return 'text-gray-400';
  }
}
