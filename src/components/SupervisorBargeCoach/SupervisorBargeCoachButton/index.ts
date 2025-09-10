import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { FlexState, PropsWithTheme, TaskCanvasChildrenProps, withTheme } from '@twilio/flex-ui';

import { localCacheClient } from '../../../services/supervisorBargeCoach';
import SupervisorBargeCoachButton from './SupervisorBargeCoachButton.Component';
import { Actions as BargeCoachStatusAction, BargeCoachStatus } from '../../../states/supervisorBargeCoach/BargeCoachState';

const mapStateToProps = (state: FlexState) => {
  const myWorkerSid = state?.flex?.worker?.worker?.sid;
  const agentWorkerSid = state?.flex?.supervisor?.stickyWorker?.worker?.sid;
  const supervisorFullName: string | undefined = state?.flex?.worker?.attributes?.full_name;

  const customReduxStore: BargeCoachStatus = (state as any)?.['barge-coach'].bargecoach;
  const {
    muted,
    barge,
    enableBargeinButton,
    coaching,
    enableCoachButton,
    coachingStatusPanel,
    coachingLoading,
    bargingLoading,
    mutingLoading,
  } = customReduxStore;


  // VOLTAR ISSO
  // const teamViewPath = state?.flex?.router?.location?.pathname;
  const teamViewPath = location.pathname;

  if (teamViewPath !== null) {
    localCacheClient.setTeamViewPath(teamViewPath);
    localCacheClient.setAgentSyncDoc(`syncDoc.${agentWorkerSid}`);
  }

  return {
    myWorkerSid,
    agentWorkerSid,
    supervisorFullName,
    muted,
    mutingLoading,
    barge,
    enableBargeinButton,
    bargingLoading,
    coaching,
    enableCoachButton,
    coachingStatusPanel,
    coachingLoading,
    disableAllButtons: coachingLoading || bargingLoading || mutingLoading,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  setBargeCoachStatus: bindActionCreators(BargeCoachStatusAction.setBargeCoachStatus, dispatch),
  resetBargeCoachStatus: bindActionCreators(BargeCoachStatusAction.resetBargeCoachStatus, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type SupervisorBargeCoachButtonConnectedProp = PropsWithTheme<ConnectedProps<typeof connector>> & TaskCanvasChildrenProps;

export default connector(withTheme(SupervisorBargeCoachButton));