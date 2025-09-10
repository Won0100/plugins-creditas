import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { FlexState, PropsWithTheme, withTheme  } from '@twilio/flex-ui';
import { BargeCoachStatus, Actions as BargeCoachStatusAction } from '../../../states/supervisorBargeCoach/BargeCoachState';
import CoachingStatusPanel from './CoachingStatusPanel.Component';

const mapStateToProps = (state: FlexState) => {
  const myWorkerSid = state?.flex?.worker?.worker?.sid;

  const { supervisorArray }: BargeCoachStatus = (state as any)?.['barge-coach'].bargecoach;

  return {
    myWorkerSid,
    supervisorArray,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  setBargeCoachStatus: bindActionCreators(BargeCoachStatusAction.setBargeCoachStatus, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type CoachingStatusPanelConnectedProp = PropsWithTheme<ConnectedProps<typeof connector>>;

export default connector(withTheme(CoachingStatusPanel));
