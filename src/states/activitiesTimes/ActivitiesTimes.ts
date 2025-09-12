import { Reducer, AnyAction } from "redux";

export type ActivitiesTimes = {
  lastActivity?: string;
}

export const initialState: ActivitiesTimes = {};

export type ActionType = {
  type: 'UPDATE_LAST_ACTIVITY',
  payload: string
}  

export const reducer: Reducer<ActivitiesTimes, ActionType> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
      case 'UPDATE_LAST_ACTIVITY': {
        return {
          lastActivity: action.payload
        };
      }         
      default:
        return state;
  }  
}
