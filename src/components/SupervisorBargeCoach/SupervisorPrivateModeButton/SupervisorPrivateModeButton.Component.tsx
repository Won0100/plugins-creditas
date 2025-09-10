import * as React from 'react';
import { IconButton, TaskHelper } from '@twilio/flex-ui';

import { initSyncDoc } from '../../../services/supervisorBargeCoach/sync';
import { ButtonContainer, buttonStyle, buttonStyleActive } from './SupervisorPrivateModeButton.Style';
import { CoachingStatusPanelConnectedProp } from './index';

export default class SupervisorPrivateModeButtonComponent extends React.Component<CoachingStatusPanelConnectedProp> {
  togglePrivateMode = async () => {
    const { coachingStatusPanel, coaching, agentWorkerSid, supervisorFullName } = this.props;
    const conferenceSid = this.props.task?.conference?.conferenceSid;

    try{
      if (coachingStatusPanel) {
        this.props.setBargeCoachStatus({
          coachingStatusPanel: false,
        });

        await initSyncDoc(agentWorkerSid ?? "", conferenceSid ?? "", supervisorFullName ?? "", 'Monitorando', 'remove');
      } else {
        this.props.setBargeCoachStatus({
          coachingStatusPanel: true,
        });
        
        if (coaching) {
          await initSyncDoc(agentWorkerSid ?? "", conferenceSid ?? "", supervisorFullName ?? "", 'Assistindo', 'add');
        }
      }
    }
    catch(error: any) {
      console.error(error)
    }
  };

  render() {
    const { coachingStatusPanel } = this.props;
    const isLiveCall = this.props.task && TaskHelper.isLiveCall(this.props.task);

    return (
      <ButtonContainer>
        {/*@ts-ignore para ignorar os erros pela falta das propriedades onPointerEnterCapture, onPointerLeaveCapture, placeholder que não existem nesse IconButton*/}
        <IconButton
          icon={coachingStatusPanel ? 'EyeBold' : 'Eye'}
          disabled={!isLiveCall}
          onClick={this.togglePrivateMode}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={coachingStatusPanel ? 'Habilita Modo Privado' : 'Desabilita Modo Privado'}
          style={coachingStatusPanel ? buttonStyleActive : buttonStyle}
        />
        {coachingStatusPanel ? 'Modo Normal' : 'Modo privado'}
      </ButtonContainer>
    );
  }
}
