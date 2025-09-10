import { combineReducers } from 'redux';
import { reducer as ActivityTeamsSyncReducer } from './ActivityTeamsSync';

export const namespace = 'activity-teams';

export const activityTeamsSyncReducer = combineReducers({
  activityTeams: ActivityTeamsSyncReducer,
});
