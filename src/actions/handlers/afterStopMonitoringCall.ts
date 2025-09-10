import { Actions, Manager } from '@twilio/flex-ui';

//import { logger } from '../utils';
import { Actions as BargeCoachStatusAction } from '../../states/supervisorBargeCoach/BargeCoachState';
import { initSyncDoc } from '../../services/supervisorBargeCoach';


export const handleAfterStopMonitoringCall = () => {
  Actions.addListener('afterStopMonitoringCall', async () => {
    //logger.log(`Unmonitor button triggered, disable the Coach and Barge-In Buttons`);

    const manager = Manager.getInstance();

    manager.store.dispatch(
      BargeCoachStatusAction.setBargeCoachStatus({
        enableCoachButton: false,
        coaching: false,
        barge: false,
        enableBargeinButton: false,
        muted: true,
      }),
    );

    const agentSid = manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
    const supervisorFullName = manager.store.getState().flex?.worker?.attributes?.full_name;

    await initSyncDoc(agentSid ?? "", '', supervisorFullName ?? "", '', 'remove');
  });
}
