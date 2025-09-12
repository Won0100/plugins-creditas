import { Reducer, AnyAction } from "redux";
import { SupervisorData } from "../../types/supervisorBargeCoach/supervisorData";

const ACTION_SET_BARGE_COACH_STATUS = 'SET_BARGE_COACH_STATUS';

export type BargeCoachStatus = {
  coaching: boolean;
  enableCoachButton: boolean;
  muted: boolean;
  barge: boolean;
  enableBargeinButton: boolean;
  supervisorArray: SupervisorData[],
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

export type BargeCoachAction = 
  | { type: typeof ACTION_SET_BARGE_COACH_STATUS; status: Partial<BargeCoachStatus> };

export class Actions {
  static setBargeCoachStatus = (status: Partial<BargeCoachStatus>) => ({ type: ACTION_SET_BARGE_COACH_STATUS, status });

  static resetBargeCoachStatus = () => ({
    type: ACTION_SET_BARGE_COACH_STATUS,
    status: { ...initialState },
  });
}

export const reduce: Reducer<BargeCoachStatus, BargeCoachAction> = function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case ACTION_SET_BARGE_COACH_STATUS: {
      return {
        ...state,
        ...action.status,
      };
    }
    
    default:
      return state;
  }
}
