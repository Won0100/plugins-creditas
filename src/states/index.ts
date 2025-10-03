import { Manager, VERSION } from "@twilio/flex-ui";

// Importando cada reducer e namespace
import { reducer as activityTeamsSyncReducer, namespace as activityTeamsSyncNamespace } from "./activityTeamsSync";
import { reducer as supervisorBargeCoachReducer, namespace as supervisorBargeCoachNamespace } from "./supervisorBargeCoach";
import { reducer as activitiesFlagColorReducer, namespace as activitiesFlagColorNamespace } from "./activitiesFlagColor";
import { reducer as activitiesTimesReducer, namespace as activitiesTimesNamespace } from "./activitiesTimes";
import { reducer as copilotIAReducer, namespace as copilotIANamespace } from "./copilotIA";

// Mapeamento de reducers
const reducersToRegister = {
  [supervisorBargeCoachNamespace]: supervisorBargeCoachReducer,
  [activityTeamsSyncNamespace]: activityTeamsSyncReducer,
  [activitiesFlagColorNamespace]: activitiesFlagColorReducer,
  [activitiesTimesNamespace]: activitiesTimesReducer,
  [copilotIANamespace]: copilotIAReducer,
};

export const registerReducers = () => {
  const manager = Manager.getInstance();

  if (!manager.store.addReducer) {
    // eslint-disable-next-line no-console
    console.error(
      `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
    );
    return;
  }

  for (let [namespace, reducer] of Object.entries(reducersToRegister)) {
    manager.store.addReducer(namespace, reducer);
  }
};
