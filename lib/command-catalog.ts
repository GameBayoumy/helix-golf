import type { Challenge } from "@/types/challenge";

export interface CommandItem {
  keys: string;
  desc: string;
}

export interface CommandGroup {
  id: string;
  title: string;
  colorToken: string;
  commands: CommandItem[];
}

export interface ChallengeCategoryMeta {
  id: Challenge["category"];
  name: string;
  desc: string;
}

export const commandGroups: CommandGroup[] = [
  {
    id: "movement",
    title: "Movement",
    colorToken: "var(--color-sage)",
    commands: [
      { keys: "hjkl", desc: "Character movement" },
      { keys: "w b e", desc: "Word movement" },
      { keys: "f t", desc: "Find / move before char" },
      { keys: "gg gh gl ge", desc: "File + line boundaries" },
    ],
  },
  {
    id: "selection",
    title: "Selection",
    colorToken: "var(--color-select)",
    commands: [
      { keys: "v", desc: "Select mode" },
      { keys: "x X", desc: "Line selection tools" },
      { keys: ";", desc: "Collapse to cursor" },
      { keys: "%", desc: "Select whole document" },
      { keys: ",", desc: "Keep primary selection" },
    ],
  },
  {
    id: "change",
    title: "Changes",
    colorToken: "var(--color-terracotta)",
    commands: [
      { keys: "i a", desc: "Insert before / after" },
      { keys: "d c r", desc: "Delete / change / replace" },
      { keys: "y p P", desc: "Yank / paste" },
      { keys: "J > < ~", desc: "Join / indent / case" },
    ],
  },
  {
    id: "surround",
    title: "Surround",
    colorToken: "var(--color-mustard)",
    commands: [
      { keys: "mi ma", desc: "Inside / around pair" },
      { keys: 'ms"', desc: "Add surround" },
    ],
  },
  {
    id: "multi",
    title: "Multi",
    colorToken: "var(--color-cyan)",
    commands: [
      { keys: "C", desc: "Copy selection down" },
      { keys: "s", desc: "Regex select prompt" },
      { keys: "u U", desc: "Undo / redo" },
    ],
  },
];

export const quickReference = commandGroups.flatMap((group) => group.commands);

export const supportedCommandTokens = new Set(
  [
    ...quickReference.flatMap((item) =>
      item.keys.split(" ").flatMap((token) => expandCommandToken(token)),
    ),
    "m",
  ],
);

export const challengeCategoryMeta: ChallengeCategoryMeta[] = [
  { id: "movement", name: "Movement", desc: "Navigate with precision" },
  { id: "selection", name: "Selection", desc: "Select with intent" },
  { id: "change", name: "Change", desc: "Transform efficiently" },
  { id: "surround", name: "Surround", desc: "Master delimiters" },
  { id: "multicursor", name: "Multi", desc: "Edit in parallel" },
];

function expandCommandToken(token: string): string[] {
  if (!token) {
    return [];
  }

  if (token === "hjkl") {
    return ["h", "j", "k", "l"];
  }

  return [token];
}
