import { Reducer, AnyAction } from "redux";
import { TeamsActivitiesDataType } from '../../types/activities';

export const initialState: TeamsActivitiesDataType[] = [];

export type ActionType = {
  type: 'SET_DATA_TEAMS_ACTIVITIES',
  payload: TeamsActivitiesDataType[]
}  

export const reducer: Reducer<TeamsActivitiesDataType[], ActionType> = (state = initialState, action: AnyAction) => {
  switch(action.type) {
      case 'SET_DATA_TEAMS_ACTIVITIES': {
        if(action?.payload) {
          return action.payload;
        }
      }         
      default:
        return state;
  }  
}
