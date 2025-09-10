import { combineReducers } from 'redux';
import { reducer as CopilotIAReducer } from './CopilotIAState';

export const namespace = 'copilot-ia';

export const copilotIAReducer = combineReducers({
  copilotIA: CopilotIAReducer,
}); 