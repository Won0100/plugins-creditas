import { AnyAction } from "redux";
import { SupervisorData } from "../../types/supervisorBargeCoach/supervisorData";

const ACTION_SET_BARGE_COACH_STATUS = 'SET_BARGE_COACH_STATUS';

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

export type BargeCoachAction = {
  type: typeof ACTION_SET_BARGE_COACH_STATUS;
  status: Partial<BargeCoachStatus>;
};

// Mantém a exportação Actions que outros arquivos importam
export class Actions {
  static setBargeCoachStatus = (status: Partial<BargeCoachStatus>): BargeCoachAction => ({
    type: ACTION_SET_BARGE_COACH_STATUS,
    status,
  });

  static resetBargeCoachStatus = (): BargeCoachAction => ({
    type: ACTION_SET_BARGE_COACH_STATUS,
    status: { ...initialState },
  });
}

// exporta reducer com assinatura que aceita AnyAction (compatível com Flex addReducer)
export const reducer = (
  state: BargeCoachStatus = initialState,
  action: AnyAction
): BargeCoachStatus => {
  switch (action.type) {
    case ACTION_SET_BARGE_COACH_STATUS: {
      // só espalha se existir status
      if (action && (action as any).status) {
        return { ...state, ...(action as any).status };
      }
      return state;
    }
    default:
      return state;
  }
};
