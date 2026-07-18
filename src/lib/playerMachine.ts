export type PlayerMode = "idle" | "off" | "loading" | "playing";

export type PlayerState = {
  mode: PlayerMode;
  activeCartridgeId: string | null;
  progress: number;
  fullscreen: boolean;
};

export type PlayerAction =
  | { type: "POWER_TOGGLE" }
  | { type: "START_LOADING"; cartridgeId: string }
  | { type: "SET_PROGRESS"; progress: number }
  | { type: "FINISH_LOADING" }
  | { type: "OPEN_FULLSCREEN" }
  | { type: "CLOSE_FULLSCREEN" };

export const initialPlayerState: PlayerState = {
  mode: "idle",
  activeCartridgeId: null,
  progress: 0,
  fullscreen: false,
};

const offState: PlayerState = {
  mode: "off",
  activeCartridgeId: null,
  progress: 0,
  fullscreen: false,
};

export function playerReducer(
  state: PlayerState,
  action: PlayerAction,
): PlayerState {
  switch (action.type) {
    case "POWER_TOGGLE":
      return state.mode === "off" ? initialPlayerState : offState;
    case "START_LOADING":
      return {
        mode: "loading",
        activeCartridgeId: action.cartridgeId,
        progress: 0,
        fullscreen: false,
      };
    case "SET_PROGRESS":
      if (state.mode !== "loading") return state;
      return {
        ...state,
        progress: Math.min(100, Math.max(0, action.progress)),
      };
    case "FINISH_LOADING":
      if (state.mode !== "loading" || !state.activeCartridgeId) return state;
      return { ...state, mode: "playing", progress: 100 };
    case "OPEN_FULLSCREEN":
      return state.mode === "playing" ? { ...state, fullscreen: true } : state;
    case "CLOSE_FULLSCREEN":
      return { ...state, fullscreen: false };
    default:
      return state;
  }
}
