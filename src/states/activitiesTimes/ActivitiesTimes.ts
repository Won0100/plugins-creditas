import { Reducer, AnyAction } from "redux";

export type ActivitiesTimes = {
  lastActivity?: string;
};

export const initialState: ActivitiesTimes = {};

export const activitiesTimesReducer: Reducer<ActivitiesTimes> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    case 'UPDATE_LAST_ACTIVITY':
      return { lastActivity: action.payload || state.lastActivity };
    default:
      return state;
  }
};
