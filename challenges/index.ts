import { Challenge } from '@/types/challenge';

export const challenges: Challenge[] = [
  // Basic Movement Challenges
  {
    id: 'basic-hjkl',
    name: 'Basic Movement',
    description: 'Navigate to the end of the line using h, j, k, l keys.',
    difficulty: 'easy',
    category: 'movement',
    initial: `Start here
Navigate to
the X mark`,
    target: `Start here
Navigate to
the X mark`,
    hints: [
      'Use l to move right',
      'Use j to move down',
      'The X is at the end of the third line',
    ],
    optimalKeystrokes: 12,
  },
  {
    id: 'word-navigation',
    name: 'Word Navigation',
    description: 'Use w, b, and e to navigate through words efficiently.',
    difficulty: 'easy',
    category: 'movement',
    initial: 'one two three four five six',
    target: 'one two three four five six',
    hints: [
      'Use w to jump to the next word start',
      'Use e to jump to the next word end',
      'Use b to jump back to the previous word start',
    ],
    optimalKeystrokes: 6,
  },

  // Selection Challenges
  {
    id: 'char-selection',
    name: 'Character Selection',
    description: 'Use x and X to select characters and lines.',
    difficulty: 'easy',
    category: 'selection',
    initial: 'hello world',
    target: 'hello',
    hints: [
      'Use x to select the current character and move right',
      'Use X to select the current line',
      'Select " world" and delete it',
    ],
    optimalKeystrokes: 7,
  },
  {
    id: 'line-selection',
    name: 'Line Selection',
    description: 'Select entire lines using x and X.',
    difficulty: 'easy',
    category: 'selection',
    initial: `keep this line
delete this line
keep this line too`,
    target: `keep this line
keep this line too`,
    hints: [
      'Use x to select the current line',
      'x extends to the next line if already on a line',
      'Select and delete the middle line',
    ],
    optimalKeystrokes: 3,
  },
  {
    id: 'extend-selection',
    name: 'Extend Selection',
    description: 'Use v to enter select mode and extend your selection.',
    difficulty: 'medium',
    category: 'selection',
    initial: 'select [these] words',
    target: '[these]',
    hints: [
      'Use v to enter select (visual) mode',
      'Move with hjkl to extend the selection',
      'Delete when you have the right selection',
    ],
    optimalKeystrokes: 10,
  },

  // Change Challenges
  {
    id: 'change-word',
    name: 'Change Word',
    description: 'Use c to change text. Select then change!',
    difficulty: 'easy',
    category: 'change',
    initial: 'replace THIS word',
    target: 'replace that word',
    hints: [
      'Select the word you want to change',
      'Use c to change the selection',
      'Type the replacement text',
    ],
    optimalKeystrokes: 10,
  },
  {
    id: 'delete-selection',
    name: 'Delete Selection',
    description: 'Use d to delete selected text.',
    difficulty: 'easy',
    category: 'change',
    initial: 'remove the BAD parts',
    target: 'remove the parts',
    hints: [
      'Select "BAD " (including the space)',
      'Use d to delete',
      'Or use x to select and d to delete',
    ],
    optimalKeystrokes: 6,
  },
  {
    id: 'replace-char',
    name: 'Replace Character',
    description: 'Use r to replace a single character.',
    difficulty: 'easy',
    category: 'change',
    initial: 'hXllo world',
    target: 'hello world',
    hints: [
      'Position cursor on the character to replace',
      'Press r then the new character',
      'No need to enter insert mode!',
    ],
    optimalKeystrokes: 2,
  },

  // Surround Challenges
  {
    id: 'match-inside',
    name: 'Match Inside',
    description: 'Use mi( to select inside parentheses.',
    difficulty: 'medium',
    category: 'surround',
    initial: 'function(old) call',
    target: 'function(new) call',
    hints: [
      'Use mi( to select inside the parentheses',
      'Then use c to change the selection',
      'Type "new" to replace',
    ],
    optimalKeystrokes: 6,
  },
  {
    id: 'match-around',
    name: 'Match Around',
    description: 'Use ma[ to select around brackets including the brackets.',
    difficulty: 'medium',
    category: 'surround',
    initial: 'data = [old_value]',
    target: 'data = new_value',
    hints: [
      'Use ma[ to select around the brackets',
      'This includes the brackets themselves',
      'Use c to change the whole selection',
    ],
    optimalKeystrokes: 12,
  },
  {
    id: 'add-surround',
    name: 'Add Surround',
    description: 'Use ms to add surround characters to a selection.',
    difficulty: 'medium',
    category: 'surround',
    initial: 'const variable = value',
    target: 'const "variable" = value',
    hints: [
      'Select the word "variable"',
      'Use ms" to add double quotes',
      'ms = match surround',
    ],
    optimalKeystrokes: 9,
  },

  // Multi-cursor Challenges
  {
    id: 'multiple-cursors',
    name: 'Multiple Cursors',
    description: 'Use C to add cursors on multiple lines.',
    difficulty: 'hard',
    category: 'multicursor',
    initial: `foo = 1
foo = 2
foo = 3`,
    target: `bar = 1
bar = 2
bar = 3`,
    hints: [
      'Select "foo" on the first line',
      'Use C to copy the selection to the next line',
      'Use c to change all selections at once',
    ],
    optimalKeystrokes: 9,
  },
  {
    id: 'split-selection',
    name: 'Split Selection',
    description: 'Use s to split selections by regex pattern.',
    difficulty: 'hard',
    category: 'multicursor',
    initial: 'apple, banana, cherry',
    target: 'APPLE, BANANA, CHERRY',
    hints: [
      'Select the entire line with x',
      'Use s to split by comma',
      'Then use ~ to switch case on all selections',
    ],
    optimalKeystrokes: 6,
  },
  {
    id: 'find-and-select',
    name: 'Find and Select',
    description: 'Use f and t for efficient navigation and selection.',
    difficulty: 'medium',
    category: 'movement',
    initial: 'key=value,key=other',
    target: 'key=VALUE,key=OTHER',
    hints: [
      'Use f= to find the next =',
      'Use l to move right and select',
      'Use C to add cursor to next line',
    ],
    optimalKeystrokes: 14,
  },
  {
    id: 'join-lines',
    name: 'Join Lines',
    description: 'Use J to join lines together.',
    difficulty: 'easy',
    category: 'change',
    initial: `first
second`,
    target: 'first second',
    hints: [
      'Use J to join the current line with the next',
      'This combines lines with a space',
    ],
    optimalKeystrokes: 1,
  },
  {
    id: 'indent-code',
    name: 'Indent Selection',
    description: 'Use > and < to indent and unindent.',
    difficulty: 'easy',
    category: 'change',
    initial: `if true:
print("indented")`,
    target: `if true:
    print("indented")`,
    hints: [
      'Select the line to indent',
      'Use > to indent',
      'Use < to unindent',
    ],
    optimalKeystrokes: 4,
  },
  {
    id: 'yank-paste',
    name: 'Yank and Paste',
    description: 'Use y and p for copy and paste.',
    difficulty: 'easy',
    category: 'change',
    initial: 'copy THIS text',
    target: 'copy THIS text THIS',
    hints: [
      'Select the text to copy',
      'Use y to yank (copy)',
      'Use p to paste after cursor',
    ],
    optimalKeystrokes: 7,
  },
  {
    id: 'collapse-selection',
    name: 'Collapse Selection',
    description: 'Use ; to collapse selection to a single cursor.',
    difficulty: 'easy',
    category: 'selection',
    initial: 'select and then collapse',
    target: 'select',
    hints: [
      'First select a word',
      'Use ; to collapse to cursor',
      'Then you can continue editing',
    ],
    optimalKeystrokes: 3,
  },
  {
    id: 'undo-redo',
    name: 'Undo and Redo',
    description: 'Use u and U for undo/redo.',
    difficulty: 'easy',
    category: 'change',
    initial: 'correct',
    target: 'correct',
    hints: [
      'Use u to undo',
      'Use U to redo',
      'Practice making and undoing changes',
    ],
    optimalKeystrokes: 0,
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id);
}

export function getChallengesByCategory(category: Challenge['category']): Challenge[] {
  return challenges.filter(c => c.category === category);
}

export function getAllCategories(): Challenge['category'][] {
  return ['movement', 'selection', 'change', 'surround', 'multicursor'];
}
