import { Reducer, AnyAction } from "redux";

export type ActivitiesTimes = {
  lastActivity?: string;
};

export const initialState: ActivitiesTimes = {};

export const reducer: Reducer<ActivitiesTimes, AnyAction> = (
  state = initialState,
  action
) => {
  if (action.type === "UPDATE_LAST_ACTIVITY" && "payload" in action) {
    return { lastActivity: action.payload };
  }
  return state;
};
