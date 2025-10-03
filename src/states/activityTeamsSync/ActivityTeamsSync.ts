import { Reducer, AnyAction } from "redux";
import { TeamsActivitiesDataType } from "../../types/activities";

export const initialState: TeamsActivitiesDataType[] = [];

export const reducer: Reducer<TeamsActivitiesDataType[], AnyAction> = (
  state = initialState,
  action
) => {
  if (action.type === "SET_DATA_TEAMS_ACTIVITIES" && "payload" in action) {
    return action.payload;
  }
  return state;
};
