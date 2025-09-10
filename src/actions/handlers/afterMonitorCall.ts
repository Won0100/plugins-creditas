import { Actions, Manager } from '@twilio/flex-ui';

//import { logger } from '../utils';
import { Actions as BargeCoachStatusAction } from '../../states/supervisorBargeCoach/BargeCoachState';

export const handleAfterMonitorCall = () => {
  Actions.addListener('afterMonitorCall', () => {
    //logger.log(`Monitor button triggered, enable the Coach and Barge-In Buttons`);

    const manager = Manager.getInstance();

    manager.store.dispatch(
      BargeCoachStatusAction.setBargeCoachStatus({
        enableCoachButton: true,
        coaching: false,
        enableBargeinButton: true,
        muted: true,
      }),
    );
  });
}
