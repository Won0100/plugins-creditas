import { combineReducers } from 'redux';

import { reduce as BargeCoachReducer } from './BargeCoachState';

export const namespace = 'barge-coach';

export const supervisorBargeCoachReducer = combineReducers({
  bargecoach: BargeCoachReducer,
});
