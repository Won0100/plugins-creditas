import { Reducer, AnyAction } from "redux";
import { SupervisorData } from "../../types/supervisorBargeCoach/supervisorData";

const ACTION_SET_BARGE_COACH_STATUS = "SET_BARGE_COACH_STATUS";

export type BargeCoachStatus = {
  coaching: boolean;
  enableCoachButton: boolean;
  muted: boolean;
  barge: boolean;
  enableBargeinButton: boolean;
  supervisorArray: SupervisorData[];
  coachingStatusPanel: boolean;
  mutingLoading?: boolean;
  bargingLoading?: boolean;
  coachingLoading?: boolean;
};

export const initialState: BargeCoachStatus = {
  coaching: false,
  enableCoachButton: false,
  muted: true,
  barge: false,
  enableBargeinButton: false,
  supervisorArray: [],
  coachingStatusPanel: true,
};

export const reduce: Reducer<BargeCoachStatus, AnyAction> = (
  state = initialState,
  action
) => {
  if (action.type === ACTION_SET_BARGE_COACH_STATUS && "status" in action) {
    return { ...state, ...action.status };
  }
  return state;
};
