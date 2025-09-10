import { combineReducers } from 'redux';
import { reducer as ActivitiesTimesReducer } from './ActivitiesTimes';

export const namespace = 'activities-times';

export const activitiesTimesReducer = combineReducers({
  activitiesTimes: ActivitiesTimesReducer,
});
