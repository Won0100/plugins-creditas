import { Reducer, AnyAction } from "redux";
import { TeamsActivitiesDataType } from '../../types/activities';

export const initialState: TeamsActivitiesDataType[] = [];

export const activityTeamsSyncReducer: Reducer<TeamsActivitiesDataType[]> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    case 'SET_DATA_TEAMS_ACTIVITIES':
      return action.payload || state;
    default:
      return state;
  }
};
