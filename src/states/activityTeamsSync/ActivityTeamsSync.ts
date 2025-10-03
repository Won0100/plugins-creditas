import { Reducer } from "redux";

export interface ActivityTeamsSyncState {
  synced: boolean;
}

export type ActivityTeamsSyncActions =
  | { type: "SET_SYNCED"; payload: boolean }
  | { type: "RESET" };

const initialState: ActivityTeamsSyncState = {
  synced: false,
};

export const reducer: Reducer<ActivityTeamsSyncState, ActivityTeamsSyncActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SET_SYNCED":
      return { ...state, synced: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export type Actions = ActivityTeamsSyncActions;
