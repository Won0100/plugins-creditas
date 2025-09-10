import { Actions, Manager, TaskHelper } from "@twilio/flex-ui";
import { clearSyncDoc, localCacheClient } from "../services/supervisorBargeCoach";
import { Actions as BargeCoachStatusAction } from "../states/supervisorBargeCoach/BargeCoachState";

export const hydrateInitialState = async () => {
    const manager = Manager.getInstance();

    const workerSid = manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
    const teamViewPath = localCacheClient.getTeamViewPath();

    if (!workerSid && teamViewPath !== null) {
      const reservationSid = teamViewPath.split('/').filter((s) => s.includes('WR'))[0];

      const task = TaskHelper.getTaskByTaskSid(reservationSid);
      if (task) {
        await Actions.invokeAction(
          'SelectTaskInSupervisor', 
          { task: task }
        );
      }

      const agentSyncDoc = localCacheClient.getAgentSyncDoc();
      if (agentSyncDoc !== null) {
        await clearSyncDoc(agentSyncDoc);
      }
      
      const privateToggle = localCacheClient.getPrivateToggle();
      if (privateToggle === 'false') {
        manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ coachingStatusPanel: false }));
      }
    }
  }