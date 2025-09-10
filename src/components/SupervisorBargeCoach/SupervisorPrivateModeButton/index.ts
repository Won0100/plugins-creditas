import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { PropsWithTheme, TaskCanvasChildrenProps, withTheme } from '@twilio/flex-ui';

import { localCacheClient } from '../../../services/supervisorBargeCoach';
import SupervisorPrivateModeButtonComponent from './SupervisorPrivateModeButton.Component';
import { Actions as BargeCoachStatusAction, BargeCoachStatus } from '../../../states/supervisorBargeCoach/BargeCoachState';

const mapStateToProps = (state: any) => {
  const agentWorkerSid: string | undefined = state?.flex?.supervisor?.stickyWorker?.worker?.sid;
  const supervisorFullName: string | undefined = state?.flex?.worker?.attributes?.full_name;

  const customReduxStore: BargeCoachStatus = state?.['barge-coach'].bargecoach;
  const { coaching, coachingStatusPanel } = customReduxStore;

  localCacheClient.setPrivateToggle(coachingStatusPanel);

  return {
    agentWorkerSid,
    supervisorFullName,
    coaching,
    coachingStatusPanel,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  setBargeCoachStatus: bindActionCreators(BargeCoachStatusAction.setBargeCoachStatus, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type CoachingStatusPanelConnectedProp = PropsWithTheme<ConnectedProps<typeof connector>> & TaskCanvasChildrenProps;

export default connector(withTheme(SupervisorPrivateModeButtonComponent));
