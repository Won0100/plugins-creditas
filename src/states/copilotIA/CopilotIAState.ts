import { AnyAction } from "redux";

export type CopilotIAState = {
  message?: string;
  author?: string;
  conversation?: any;
  task?: any;
};

export const initialState: CopilotIAState = {};

export type ActionType = {
  type: 'SET_COPILOT_IA_MESSAGE';
  payload: CopilotIAState;
};

export const reducer = (
  state: CopilotIAState = initialState,
  action: AnyAction
): CopilotIAState => {
  switch (action.type) {
    case 'SET_COPILOT_IA_MESSAGE': {
      if (action && (action as any).payload) {
        return (action as any).payload;
      }
      return state;
    }
    default:
      return state;
  }
};
