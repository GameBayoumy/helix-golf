import { Challenge } from "@/types/challenge";
import { validateChallenges } from "@/lib/challenge-schema";

const rawChallenges: Challenge[] = [
  {
    id: "basic-hjkl",
    name: "Basic Movement",
    description: "Use h, j, k, and l to move the cursor to the X.",
    difficulty: "easy",
    category: "movement",
    initial: `Start here
Move down
X`,
    goal: {
      cursor: { line: 2, column: 0 },
      mode: "normal",
    },
    hints: [
      "Use j to move down a line.",
      "Use h and l for horizontal movement.",
      "The goal is the X on line 3.",
    ],
    optimalKeystrokes: 2,
    supportedCommands: ["h", "j", "k", "l"],
  },
  {
    id: "word-navigation",
    name: "Word Navigation",
    description: "Jump to the start of delta using word motions.",
    difficulty: "easy",
    category: "movement",
    initial: "alpha beta gamma delta",
    goal: {
      cursor: { line: 0, column: 17 },
      mode: "normal",
    },
    hints: [
      "w moves to the next word start.",
      "b moves back to the previous word start.",
      "delta begins at column 18 if you count from 1.",
    ],
    optimalKeystrokes: 3,
    supportedCommands: ["w", "b", "e"],
  },
  {
    id: "find-char",
    name: "Find Character",
    description: "Use f= to land on the equals sign.",
    difficulty: "easy",
    category: "movement",
    initial: "key=value",
    goal: {
      cursor: { line: 0, column: 3 },
      mode: "normal",
    },
    hints: [
      "f waits for the character to find.",
      "The target character is =.",
    ],
    optimalKeystrokes: 2,
    supportedCommands: ["f"],
  },
  {
    id: "select-line",
    name: "Select A Line",
    description: "Use x to select the full middle line.",
    difficulty: "easy",
    category: "selection",
    initial: `keep
pick me
keep`,
    initialSelections: [
      {
        anchor: { line: 1, column: 0 },
        head: { line: 1, column: 0 },
      },
    ],
    goal: {
      selections: [
        {
          start: { line: 1, column: 0 },
          end: { line: 2, column: 0 },
        },
      ],
      mode: "select",
    },
    hints: [
      "x selects the current line.",
      "You are already on the line you need.",
    ],
    optimalKeystrokes: 1,
    supportedCommands: ["x"],
  },
  {
    id: "extend-line-bounds",
    name: "Extend To Line Bounds",
    description: "Use X to expand the current selection to the full line.",
    difficulty: "easy",
    category: "selection",
    initial: "const value = 1;",
    initialSelections: [
      {
        anchor: { line: 0, column: 6 },
        head: { line: 0, column: 10 },
      },
    ],
    goal: {
      selections: [
        {
          start: { line: 0, column: 0 },
          end: { line: 0, column: 16 },
        },
      ],
      mode: "select",
    },
    hints: [
      "X expands the active selection to line bounds.",
      "The whole line is the target, not just value.",
    ],
    optimalKeystrokes: 1,
    supportedCommands: ["X"],
  },
  {
    id: "delete-line",
    name: "Delete A Line",
    description: "Use x followed by d to remove the middle line.",
    difficulty: "easy",
    category: "change",
    initial: `keep this
remove this
keep too`,
    initialSelections: [
      {
        anchor: { line: 1, column: 0 },
        head: { line: 1, column: 0 },
      },
    ],
    goal: {
      buffer: `keep this
keep too`,
      mode: "normal",
    },
    hints: [
      "x selects the current line.",
      "d deletes the active selection.",
    ],
    optimalKeystrokes: 2,
    supportedCommands: ["x", "d"],
  },
  {
    id: "replace-char",
    name: "Replace Character",
    description: "Use r to replace the wrong character.",
    difficulty: "easy",
    category: "change",
    initial: "hXllo world",
    initialSelections: [
      {
        anchor: { line: 0, column: 1 },
        head: { line: 0, column: 1 },
      },
    ],
    goal: {
      buffer: "hello world",
      mode: "normal",
    },
    hints: [
      "r waits for the replacement character.",
      "You only need to replace X.",
    ],
    optimalKeystrokes: 2,
    supportedCommands: ["r"],
  },
  {
    id: "join-lines",
    name: "Join Lines",
    description: "Use J to join the two lines with a space.",
    difficulty: "easy",
    category: "change",
    initial: `first
second`,
    goal: {
      buffer: "first second",
      mode: "normal",
    },
    hints: [
      "J joins the current line with the next line.",
    ],
    optimalKeystrokes: 1,
    supportedCommands: ["J"],
  },
  {
    id: "indent-line",
    name: "Indent A Line",
    description: "Select the second line and indent it.",
    difficulty: "easy",
    category: "change",
    initial: `if true:
print("hi")`,
    initialSelections: [
      {
        anchor: { line: 1, column: 0 },
        head: { line: 1, column: 0 },
      },
    ],
    goal: {
      buffer: `if true:
    print("hi")`,
      mode: "normal",
    },
    hints: [
      "x selects the current line.",
      "> indents the selected line.",
    ],
    optimalKeystrokes: 2,
    supportedCommands: ["x", ">"],
  },
  {
    id: "match-inside",
    name: "Match Inside",
    description: "Use mi( to select inside parentheses, then change the text.",
    difficulty: "medium",
    category: "surround",
    initial: "function(old) call",
    initialSelections: [
      {
        anchor: { line: 0, column: 9 },
        head: { line: 0, column: 9 },
      },
    ],
    goal: {
      buffer: "function(new) call",
      mode: "normal",
    },
    hints: [
      "m starts a surround/textobject sequence.",
      "mi( selects the text inside the parentheses.",
      "After c, type new and press Escape.",
    ],
    optimalKeystrokes: 8,
    supportedCommands: ["m", "c"],
  },
  {
    id: "match-around",
    name: "Match Around",
    description: "Use ma[ to select the bracketed expression, then change it.",
    difficulty: "medium",
    category: "surround",
    initial: "data = [old_value]",
    initialSelections: [
      {
        anchor: { line: 0, column: 8 },
        head: { line: 0, column: 8 },
      },
    ],
    goal: {
      buffer: "data = new_value",
      mode: "normal",
    },
    hints: [
      "ma[ selects around the brackets, including the brackets.",
      "Use c to replace the whole selection.",
    ],
    optimalKeystrokes: 14,
    supportedCommands: ["m", "c"],
  },
  {
    id: "add-surround",
    name: "Add Surround",
    description: "Use ms\" to wrap the existing selection in double quotes.",
    difficulty: "medium",
    category: "surround",
    initial: "const variable = value",
    initialSelections: [
      {
        anchor: { line: 0, column: 6 },
        head: { line: 0, column: 13 },
      },
    ],
    goal: {
      buffer: `const "variable" = value`,
      mode: "normal",
    },
    hints: [
      "The word is already selected.",
      "Use ms\" to add the surround.",
    ],
    optimalKeystrokes: 3,
    supportedCommands: ["m"],
  },
  {
    id: "multiple-cursors",
    name: "Multiple Cursors",
    description: "Use C and c to rename foo to bar on every line.",
    difficulty: "hard",
    category: "multicursor",
    initial: `foo = 1
foo = 2
foo = 3`,
    initialSelections: [
      {
        anchor: { line: 0, column: 0 },
        head: { line: 0, column: 2 },
      },
    ],
    goal: {
      buffer: `bar = 1
bar = 2
bar = 3`,
      mode: "normal",
    },
    hints: [
      "The first foo is already selected.",
      "C copies that selection to the next line.",
      "After all selections are present, use c, type bar, then Escape.",
    ],
    optimalKeystrokes: 7,
    supportedCommands: ["C", "c"],
  },
  {
    id: "regex-select",
    name: "Regex Select",
    description: "Use % and sfoo to select both foo matches, then change them.",
    difficulty: "hard",
    category: "multicursor",
    initial: "foo, bar, foo",
    goal: {
      buffer: "baz, bar, baz",
      mode: "normal",
    },
    hints: [
      "% selects the entire document.",
      "s opens a regex prompt. Type foo and press Enter.",
      "Use c to replace all matches at once.",
    ],
    optimalKeystrokes: 11,
    supportedCommands: ["%", "s", "c"],
  },
];

export const challenges = validateChallenges(rawChallenges);

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((challenge) => challenge.id === id);
}

export function getChallengesByCategory(category: Challenge["category"]): Challenge[] {
  return challenges.filter((challenge) => challenge.category === category);
}

export function getAllCategories(): Challenge["category"][] {
  return ["movement", "selection", "change", "surround", "multicursor"];
}
