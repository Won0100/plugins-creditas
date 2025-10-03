import { Reducer } from "redux";

export interface ActivitiesTimesState {
  lastActivityChange?: string;
}

export type ActivitiesTimesActions =
  | { type: "SET_LAST_ACTIVITY_CHANGE"; payload: string }
  | { type: "RESET" };

const initialState: ActivitiesTimesState = {};

export const reducer: Reducer<ActivitiesTimesState, ActivitiesTimesActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SET_LAST_ACTIVITY_CHANGE":
      return { ...state, lastActivityChange: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export type Actions = ActivitiesTimesActions;
