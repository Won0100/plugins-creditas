import { AnyAction } from "redux";

export type ActivitiesTimes = {
  lastActivity?: string;
};

export const initialState: ActivitiesTimes = {};

export type ActionType = {
  type: 'UPDATE_LAST_ACTIVITY';
  payload: string;
};

export const reducer = (
  state: ActivitiesTimes = initialState,
  action: AnyAction
): ActivitiesTimes => {
  switch (action.type) {
    case 'UPDATE_LAST_ACTIVITY': {
      return { lastActivity: (action as any).payload };
    }
    default:
      return state;
  }
};
