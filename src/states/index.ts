import { Manager, VERSION } from "@twilio/flex-ui";
import { namespace as activityTeamsSyncNamespace, activityTeamsSyncReducer } from './activityTeamsSync';
import { supervisorBargeCoachReducer, namespace as supervisorBargeCoachNamespace } from "./supervisorBargeCoach";
import { activitiesFlagColorReducer, namespace as activitiesFlagColorNamespace } from './activitiesFlagColor';
import { activitiesTimesReducer, namespace as activitiesTimesReducerNamespace} from "./activitiesTimes";
import { copilotIAReducer, namespace as copilotIANamespace } from "./copilotIA";

const reducersToRegister = {
    [supervisorBargeCoachNamespace]: supervisorBargeCoachReducer,
    [activityTeamsSyncNamespace]: activityTeamsSyncReducer,
    [activitiesFlagColorNamespace]: activitiesFlagColorReducer,
    [activitiesTimesReducerNamespace]: activitiesTimesReducer,
    [copilotIANamespace]: copilotIAReducer,
}

export const registerReducers = () => {
    const manager = Manager.getInstance();

    if (!manager.store.addReducer) {
        // eslint-disable-next-line no-console
        console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
        return;
    }

    for (let [namespace, reducers] of Object.entries(reducersToRegister)) {
        manager.store.addReducer(namespace, reducers);
    }
}