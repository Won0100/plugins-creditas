import { combineReducers } from 'redux';
import { reducer as ActivitiesFlagColorReducer } from './ActivitiesFlagColor';

export const namespace = 'activities-flag-color';

export const activitiesFlagColorReducer = combineReducers({
  activitiesFlagColor: ActivitiesFlagColorReducer,
});
