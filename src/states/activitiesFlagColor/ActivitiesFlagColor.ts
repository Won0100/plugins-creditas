import { Reducer, AnyAction } from "redux";
import { ActivityColorType } from '../../types/activities';

export const initialState: ActivityColorType = {};

export type ActionType = {
  type: 'SET_DATA_ACTIVITIES_FLAG_COLOR',
  payload: ActivityColorType;
}  

export const reducer: Reducer<ActivityColorType, ActionType> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
      case 'SET_DATA_ACTIVITIES_FLAG_COLOR': {
        if(action?.payload) {
          return action.payload;
        }
      }         
      default:
        return state;
  }  
}
