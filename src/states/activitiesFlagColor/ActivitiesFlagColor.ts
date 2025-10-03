import { Reducer, AnyAction } from "redux";
import { ActivityColorType } from '../../types/activities';

export const initialState: ActivityColorType = {};

export const activitiesFlagColorReducer: Reducer<ActivityColorType> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    case 'SET_DATA_ACTIVITIES_FLAG_COLOR':
      return action.payload || state;
    default:
      return state;
  }
};
