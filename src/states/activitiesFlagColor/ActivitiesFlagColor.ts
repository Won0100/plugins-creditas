import { AnyAction } from "redux";
import { ActivityColorType } from '../../types/activities';

export const initialState: ActivityColorType = {};

export type ActionType = {
  type: 'SET_DATA_ACTIVITIES_FLAG_COLOR';
  payload: ActivityColorType;
};

export const reducer = (
  state: ActivityColorType = initialState,
  action: AnyAction
): ActivityColorType => {
  switch (action.type) {
    case 'SET_DATA_ACTIVITIES_FLAG_COLOR': {
      if (action && (action as any).payload) {
        return (action as any).payload;
      }
      return state;
    }
    default:
      return state;
  }
};
