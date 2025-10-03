import { Reducer } from "redux";

export interface BargeCoachState {
  monitoring: boolean;
  coaching: boolean;
  privateMode: boolean;
}

export type BargeCoachActions =
  | { type: "START_MONITORING" }
  | { type: "STOP_MONITORING" }
  | { type: "START_COACHING" }
  | { type: "STOP_COACHING" }
  | { type: "ENABLE_PRIVATE_MODE" }
  | { type: "DISABLE_PRIVATE_MODE" }
  | { type: "RESET" };

const initialState: BargeCoachState = {
  monitoring: false,
  coaching: false,
  privateMode: false,
};

export const reducer: Reducer<BargeCoachState, BargeCoachActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "START_MONITORING":
      return { ...state, monitoring: true };
    case "STOP_MONITORING":
      return { ...state, monitoring: false };
    case "START_COACHING":
      return { ...state, coaching: true };
    case "STOP_COACHING":
      return { ...state, coaching: false };
    case "ENABLE_PRIVATE_MODE":
      return { ...state, privateMode: true };
    case "DISABLE_PRIVATE_MODE":
      return { ...state, privateMode: false };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export type Actions = BargeCoachActions;
