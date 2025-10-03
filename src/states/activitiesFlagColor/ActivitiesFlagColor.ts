import { Reducer } from "redux";

export interface ActivitiesFlagColorState {
  colorFlags: Record<string, string>; // exemplo de mapeamento por activitySid
}

export type ActivitiesFlagColorActions =
  | { type: "SET_ACTIVITY_COLOR"; payload: { activitySid: string; color: string } }
  | { type: "RESET_ACTIVITY_COLORS" };

const initialState: ActivitiesFlagColorState = {
  colorFlags: {},
};

export const reducer: Reducer<ActivitiesFlagColorState, ActivitiesFlagColorActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVITY_COLOR":
      return {
        ...state,
        colorFlags: {
          ...state.colorFlags,
          [action.payload.activitySid]: action.payload.color,
        },
      };
    case "RESET_ACTIVITY_COLORS":
      return initialState;
    default:
      return state;
  }
};

export type Actions = ActivitiesFlagColorActions;
