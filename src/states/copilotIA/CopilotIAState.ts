import { Reducer, AnyAction } from "redux";

export type CopilotIAState = {
  message?: string;
  author?: string;
  conversation?: any;
  task?: any;
}

export const initialState: CopilotIAState = {};

export type ActionType = {
  type: 'SET_COPILOT_IA_MESSAGE',
  payload: CopilotIAState;
}

export const reducer: Reducer<CopilotIAState, ActionType> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    case 'SET_COPILOT_IA_MESSAGE': {
      if(action?.payload) {
        return action.payload;
      }
    }         
    default:
      return state;
  }  
} 