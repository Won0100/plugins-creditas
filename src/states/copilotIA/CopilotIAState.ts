import { Reducer, AnyAction } from "redux";

export type CopilotIAState = {
  message?: string;
  author?: string;
  conversation?: any;
  task?: any;
};

export const initialState: CopilotIAState = {};

export const copilotIAReducer: Reducer<CopilotIAState> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    case 'SET_COPILOT_IA_MESSAGE':
      return action.payload || state;
    default:
      return state;
  }
};
