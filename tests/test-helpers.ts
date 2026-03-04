import { EditorKeyInput, EngineState, createEngineState, handleEditorKey } from "@/lib/helix-engine";
import { SelectionState } from "@/types/challenge";

export function keyInput(key: string): EditorKeyInput {
  return {
    key,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
  };
}

export function pressKeys(
  content: string,
  keys: string[],
  initialSelections?: SelectionState[],
): EngineState {
  let state = createEngineState(content, initialSelections);

  for (const key of keys) {
    const result = handleEditorKey(state, keyInput(key));
    if (!result.handled) {
      throw new Error(`Key was not handled: ${key}`);
    }
    state = result.state;
  }

  return state;
}
