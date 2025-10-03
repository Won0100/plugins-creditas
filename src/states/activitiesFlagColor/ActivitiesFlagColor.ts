import { Reducer, AnyAction } from "redux";
import { ActivityColorType } from "../../types/activities";

export const initialState: ActivityColorType = {};

export const reducer: Reducer<ActivityColorType, AnyAction> = (
  state = initialState,
  action
) => {
  if (action.type === "SET_DATA_ACTIVITIES_FLAG_COLOR" && "payload" in action) {
    return action.payload;
  }
  return state;
};
