import { describe, expect, it } from "vitest";

import { createSnapshot } from "@/lib/helix-engine";

import { pressKeys } from "./test-helpers";

describe("helix engine subset", () => {
  it("treats x as a linewise selection including the trailing newline", () => {
    const state = pressKeys(
      "keep\npick me\nkeep",
      ["x"],
      [{ anchor: { line: 1, column: 0 }, head: { line: 1, column: 0 } }],
    );

    const snapshot = createSnapshot(state);
    expect(snapshot.mode).toBe("select");
    expect(snapshot.selectionGoals).toEqual([
      {
        start: { line: 1, column: 0 },
        end: { line: 2, column: 0 },
      },
    ]);
  });

  it("deletes a selected line and its newline with x d", () => {
    const state = pressKeys(
      "keep this\nremove this\nkeep too",
      ["x", "d"],
      [{ anchor: { line: 1, column: 0 }, head: { line: 1, column: 0 } }],
    );

    expect(state.content).toBe("keep this\nkeep too");
    expect(state.mode).toBe("normal");
  });

  it("extends an existing selection to line bounds with X", () => {
    const state = pressKeys(
      "const value = 1;",
      ["X"],
      [{ anchor: { line: 0, column: 6 }, head: { line: 0, column: 10 } }],
    );

    expect(createSnapshot(state).selectionGoals).toEqual([
      {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 16 },
      },
    ]);
  });

  it("appends after the cursor with a", () => {
    const state = pressKeys(
      "foo",
      ["a", "X", "Escape"],
      [{ anchor: { line: 0, column: 0 }, head: { line: 0, column: 0 } }],
    );

    const snapshot = createSnapshot(state);
    expect(state.content).toBe("fXoo");
    expect(snapshot.cursor).toEqual({ line: 0, column: 1 });
  });

  it("supports goto boundaries with gg and ge", () => {
    const top = pressKeys(
      "alpha\nbeta\ngamma",
      ["g", "g"],
      [{ anchor: { line: 1, column: 2 }, head: { line: 1, column: 2 } }],
    );
    const end = pressKeys(
      "alpha\nbeta\ngamma",
      ["g", "e"],
      [{ anchor: { line: 1, column: 2 }, head: { line: 1, column: 2 } }],
    );

    expect(createSnapshot(top).cursor).toEqual({ line: 0, column: 0 });
    expect(createSnapshot(end).cursor).toEqual({ line: 2, column: 4 });
  });

  it("limits regex selection to the current selection range", () => {
    const state = pressKeys("foo, bar, foo", ["s", "f", "o", "o", "Enter"]);

    expect(state.mode).toBe("normal");
    expect(state.status).toBe("Regex matched nothing.");
  });

  it("changes every regex match after selecting the whole document", () => {
    const state = pressKeys("foo, bar, foo", ["%", "s", "f", "o", "o", "Enter", "c", "b", "a", "z", "Escape"]);

    expect(state.content).toBe("baz, bar, baz");
    expect(state.mode).toBe("normal");
  });

  it("copies selections down without duplicating existing selections", () => {
    const state = pressKeys(
      "foo = 1\nfoo = 2\nfoo = 3",
      ["C", "C", "c", "b", "a", "r", "Escape"],
      [{ anchor: { line: 0, column: 0 }, head: { line: 0, column: 2 } }],
    );

    expect(state.content).toBe("bar = 1\nbar = 2\nbar = 3");
    expect(state.selections).toHaveLength(3);
  });

  it("supports surround motions for inside and around pairs", () => {
    const inside = pressKeys(
      "function(old) call",
      ["m", "i", "(", "c", "n", "e", "w", "Escape"],
      [{ anchor: { line: 0, column: 9 }, head: { line: 0, column: 9 } }],
    );
    const around = pressKeys(
      "data = [old_value]",
      ["m", "a", "[", "c", "n", "e", "w", "_", "v", "a", "l", "u", "e", "Escape"],
      [{ anchor: { line: 0, column: 8 }, head: { line: 0, column: 8 } }],
    );

    expect(inside.content).toBe("function(new) call");
    expect(around.content).toBe("data = new_value");
  });

  it("supports undo and redo for content edits", () => {
    const state = pressKeys(
      "hXllo",
      ["r", "e", "u", "U"],
      [{ anchor: { line: 0, column: 1 }, head: { line: 0, column: 1 } }],
    );

    expect(state.content).toBe("hello");
    expect(state.mode).toBe("normal");
  });
});
