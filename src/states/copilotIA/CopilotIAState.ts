import { Reducer, AnyAction } from "redux";

export type CopilotIAState = {
  message?: string;
  author?: string;
  conversation?: any;
  task?: any;
};

export const initialState: CopilotIAState = {};

export const reducer: Reducer<CopilotIAState, AnyAction> = (
  state = initialState,
  action
) => {
  if (action.type === "SET_COPILOT_IA_MESSAGE" && "payload" in action) {
    return action.payload;
  }
  return state;
};
