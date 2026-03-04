import type { ReactNode } from "react";
import {
  Braces,
  Layers,
  Move,
  Scissors,
  Sparkles,
} from "lucide-react";

import { commandGroups } from "@/lib/command-catalog";

const icons: Record<string, ReactNode> = {
  movement: <Move size={14} />,
  selection: <Layers size={14} />,
  change: <Scissors size={14} />,
  surround: <Braces size={14} />,
  multi: <Sparkles size={14} />,
};

interface SupportedCommandGuideProps {
  compact?: boolean;
  dark?: boolean;
}

export default function SupportedCommandGuide({
  compact = false,
  dark = false,
}: SupportedCommandGuideProps) {
  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {commandGroups.map((group) => (
        <div key={group.id}>
          <div
            className="mb-2 flex items-center gap-2 text-xs font-semibold"
            style={{ color: group.colorToken }}
          >
            {icons[group.id]}
            <span>{group.title}</span>
          </div>
          <div className="space-y-1">
            {group.commands.map((command) => (
              <div
                key={`${group.id}-${command.keys}`}
                className={`flex items-center justify-between gap-4 ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                <code className={dark ? "command-chip-dark" : "command-chip-light"}>
                  {command.keys}
                </code>
                <span className={`text-right ${dark ? "text-[var(--editor-muted)]" : "text-[var(--text-subtle)]"}`}>
                  {command.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
