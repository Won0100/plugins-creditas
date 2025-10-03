import { Reducer } from "redux";

export interface CopilotIAState {
  enabled: boolean;
  lastResponse?: string;
}

export type CopilotIAActions =
  | { type: "SET_ENABLED"; payload: boolean }
  | { type: "SET_RESPONSE"; payload: string }
  | { type: "RESET" };

const initialState: CopilotIAState = {
  enabled: false,
};

export const reducer: Reducer<CopilotIAState, CopilotIAActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SET_ENABLED":
      return { ...state, enabled: action.payload };
    case "SET_RESPONSE":
      return { ...state, lastResponse: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export type Actions = CopilotIAActions;
