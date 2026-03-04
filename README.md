# Helix Dojo

Helix Dojo is a browser-based practice app for learning a focused, correct subset of Helix.

## What Changed

The project now uses a single custom editor engine instead of a themed Monaco instance pretending to be Helix.

Architecture after the refactor:
- `lib/helix-engine.ts`: pure editor engine for the supported Helix subset
- `lib/challenge-runtime.ts`: reducer-driven challenge session state
- `lib/command-catalog.ts`: shared command metadata for UI and validation
- `lib/challenge-schema.ts`: challenge content validation
- `lib/progress.ts`: local persistence model for saved browser progress
- `lib/use-progress.ts`: client hook for reading and writing saved progress
- `challenges/index.ts`: validated challenge content
- `app/`: mostly route composition and presentation

Current goals:
- Validate real editor state, not just final buffer text
- Teach a documented subset well before expanding scope
- Keep challenge definitions aligned with official Helix semantics

## Supported Subset

Modes:
- `normal`
- `select`
- `insert`

Commands:
- Movement: `h`, `j`, `k`, `l`, `w`, `b`, `e`, `f`, `t`, `gg`, `gh`, `gl`, `ge`
- Selection: `v`, `x`, `X`, `;`, `%`, `,`
- Changes: `i`, `a`, `d`, `c`, `r`, `y`, `p`, `P`, `J`, `>`, `<`, `~`
- Surround: `mi`, `ma`, `ms`
- Multi-cursor: `C`, `s`
- History: `u`, `U`

## Challenge Model

Each challenge now declares:
- Initial buffer
- Optional initial selection state
- A concrete goal

Goals can validate:
- Buffer contents
- Cursor position
- Selection ranges
- Mode

That means movement and selection drills are now real drills instead of target-buffer no-ops.

## Concrete Implementation Plan

Completed in this refactor:
1. Replace Monaco with a single custom Helix engine.
2. Move challenge validation to engine snapshots.
3. Rewrite the challenge list around explicit goals and supported commands.
4. Remove dead prototype editor paths.
5. Add engine and challenge-solution tests for the supported subset.
6. Add a reducer-based challenge runtime and shared command catalog.
7. Move fonts to `next/font`, centralize theme tokens, and reduce page-level client coupling.
8. Add browser-local progress persistence with summary and per-challenge saved records.

Next steps:
1. Run `npm test`, `npm run lint`, and `npm run build` after installing dependencies.
2. Expand textobject support beyond surrounds.
3. Improve rendering for large files and richer cursor visuals.
4. Add progress persistence, leaderboards, and personal stats.
5. Broaden the supported Helix subset only after the current commands are tested.

## Running

Install dependencies, then start the Next.js app:

```bash
npm install
npm test
npm run dev
```

Open `http://localhost:3000`.

## Source References

The challenge audit and command choices were aligned to the official Helix documentation:
- https://github.com/helix-editor/helix
- https://docs.helix-editor.com/master/usage.html
- https://docs.helix-editor.com/master/commands.html
- https://docs.helix-editor.com/master/surround.html
- https://docs.helix-editor.com/master/textobjects.html
- https://docs.helix-editor.com/master/from-vim.html
