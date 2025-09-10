import * as React from 'react';
import { TaskHelper } from '@twilio/flex-ui';

//import { logger } from '../../utils';
import { ButtonContainer, buttonStyle, buttonStyleActive } from './SupervisorBargeCoachButton.Style';
import AbstractSyncComponent, { CallbackListenerParams } from '../AbstractSyncComponent';
import { Button } from '../Button';
import { initSyncDoc, conferenceClient } from '../../../services/supervisorBargeCoach';
import type { SupervisorBargeCoachButtonConnectedProp } from  './index'

// Esse tipo está sendo criado para corrigir o ParticipantTypes, que os dados que vem da Twilio para esse tipo não estão batendo 
// com essa tipagem do ParticipantTypes
type ParticipantTypesFixed =  "supervisor" | "worker" | "customer";

export default class SupervisorBargeCoachButton extends AbstractSyncComponent<SupervisorBargeCoachButtonConnectedProp> {
  private listenerAdded = false;

  componentDidUpdate = async () => {
    if (!this.listenerAdded && this.props.agentWorkerSid) {
      this.listenerAdded = true;
      await this.setupListener(`syncDoc.${this.props.agentWorkerSid}`, this.onDocUpdated);
    }
  };

  render() {
    const {
      muted,
      mutingLoading,
      barge,
      bargingLoading,
      enableBargeinButton,
      coaching,
      coachingLoading,
      enableCoachButton,
      task,
      disableAllButtons,
    } = this.props;

    const isLiveCall = task && TaskHelper.isLiveCall(task);

    return (
      <ButtonContainer>
        <Button
          loading={mutingLoading}
          icon={muted ? 'MuteLargeBold' : 'MuteLarge'}
          disabled={
            !isLiveCall || !enableBargeinButton || !enableCoachButton || (!barge && !coaching) || disableAllButtons
          }
          onClick={this.asyncToggleMuteHandler}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title="Mudo"
          style={buttonStyle}
        />
        <Button
          loading={bargingLoading}
          icon={barge ? `IncomingCallBold` : 'IncomingCall'}
          disabled={!isLiveCall || !enableBargeinButton || disableAllButtons}
          onClick={this.asyncBargeHandleClick}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={barge ? 'Sair da Chamada' : 'Entrar na Chamada'}
          style={barge ? buttonStyleActive : buttonStyle}
        />
        <Button
          loading={coachingLoading}
          icon={coaching ? `DefaultAvatarBold` : `DefaultAvatar`}
          disabled={!isLiveCall || !enableCoachButton || disableAllButtons}
          onClick={this.asyncCoachHandleClick}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={coaching ? 'Desabilitar Modo de Assistência' : 'Habilitar Modo de Assistência'}
          style={coaching ? buttonStyleActive : buttonStyle}
        />
      </ButtonContainer>
    );
  }

  actionAsyncHandler = async (key: "muting" | "barging" | "coaching", action: () => Promise<void>) => {
    const loadingKey: `${typeof key}Loading` = `${key}Loading`;
    this.props.setBargeCoachStatus({ [loadingKey]: true });
    try {
      await action();
    } finally {
      this.props.setBargeCoachStatus({ [loadingKey]: false });
    }
  };

  asyncToggleMuteHandler = () => this.actionAsyncHandler('muting', this.toggleMuteHandle);

  asyncBargeHandleClick = () => this.actionAsyncHandler('barging', this.bargeHandleClick);

  asyncCoachHandleClick = () => this.actionAsyncHandler('coaching', this.coachHandleClick);

  unmuteParticipant = async () => {
    await conferenceClient.unmuteParticipant(this.conferenceSid ?? "", this.supervisorParticipant?.participantSid ?? "");
    this.props.setBargeCoachStatus({ muted: false });
  };

  muteParticipant = async () => {
    await conferenceClient.muteParticipant(this.conferenceSid ?? "", this.supervisorParticipant?.participantSid ?? "");
    this.props.setBargeCoachStatus({ muted: true });
  };

  toggleMuteHandle = async () => {
    //logger.log('Handling mute button toggle');

    if (!this.supervisorParticipant?.participantSid) {
      //logger.log('supervisorParticipant is null, skipping bargeHandleClick');
      return;
    }

    if (this.props.muted) {
      await this.unmuteParticipant();
    } else {
      await this.muteParticipant();
    }
  };

  bargeIn = async () => {
    await this.unmuteParticipant();
    this.props.setBargeCoachStatus({
      muted: this.props.muted,
      barge: true,
      coaching: false,
    });
  };

  bargeOut = async () => {
    await this.muteParticipant();
    this.props.setBargeCoachStatus({
      muted: false,
      barge: false,
      coaching: false,
    });
  };

  bargeHandleClick = async () => {
    //logger.log('Handling Barge button toggle');

    if (!this.supervisorParticipant?.participantSid) {
      //logger.log('supervisorParticipant is null, skipping bargeHandleClick');
      return;
    }

    if (this.props.barge) {
      await this.bargeOut();
    } else {
      if (this.props.coaching) {
        await this.disableCoaching();
      }

      await this.bargeIn();
    }
  };

  disableCoaching = async () => {
    const { agentWorkerSid, supervisorFullName } = this.props;
    const { supervisorParticipant, agentParticipant, conferenceSid } = this;

    await conferenceClient.disableCoaching(conferenceSid ?? "", supervisorParticipant?.participantSid ?? "", agentParticipant?.participantSid ?? "");
    this.props.setBargeCoachStatus({
      coaching: false,
      muted: true,
      barge: false,
    });
    
    await initSyncDoc(agentWorkerSid ?? "", conferenceSid ?? "", supervisorFullName ?? "", 'Monitorando', 'remove');
  };

  enableCoaching = async () => {
    const { agentWorkerSid, supervisorFullName } = this.props;
    const { supervisorParticipant, agentParticipant, conferenceSid } = this;

    await conferenceClient.enableCoaching(conferenceSid ?? "", supervisorParticipant?.participantSid ?? "", agentParticipant?.participantSid ?? "");
    this.props.setBargeCoachStatus({
      coaching: true,
      muted: false,
      barge: false,
    });

    if (this.props.coachingStatusPanel) {
      await initSyncDoc(agentWorkerSid ?? "", conferenceSid ?? "", supervisorFullName ?? "", 'Assistindo', 'add');
    }
  };

  coachHandleClick = async () => {
    //logger.log('Handling Coach button toggle');

    const { supervisorParticipant, agentParticipant } = this;

    if (!supervisorParticipant?.participantSid || !agentParticipant?.participantSid) {
      //logger.log('supervisorParticipant or agentParticipant is null, skipping coachHandleClick');
      return;
    }
    //logger.log(`Current agentWorker is ${this.props.agentWorkerSid}`);

    if (this.props.coaching) {
      await this.disableCoaching();
    } else {
      if (this.props.barge) {
        await this.muteParticipant();
      }

      await this.enableCoaching();
    }
  };

  onDocUpdated = (doc: CallbackListenerParams[0]) => {
    const supervisors = doc.data?.supervisors || [];

    if (doc.isLocal === false && supervisors.length === 0) {
      this.props.resetBargeCoachStatus();
    }
  };

  get conferenceSid() {
    return this.props.task?.conference?.conferenceSid;
  }

  get supervisorParticipant() {
    const { muted, myWorkerSid } = this.props;
    const children = this.props.task?.conference?.source?.channelParticipants || [];


    const participant = children.find(
      (p) =>  (p.type as ParticipantTypesFixed) === 'supervisor' && p.mediaProperties.status === 'joined' && myWorkerSid === p.routingProperties.workerSid,
    );
    //logger.log(`Current supervisor is ${participant?.key} with status ${muted ? 'muted' : 'unmuted'}`);

    return participant;
  }

  get agentParticipant() {
    const children = this.props.task?.conference?.source?.channelParticipants || [];

    const participant = children.find(
      (p) => (p.type as ParticipantTypesFixed) === 'worker' && this.props.agentWorkerSid === p.routingProperties.workerSid,
    );

    //logger.log(`Current agentWorker is ${participant?.key}`);

    return participant;
  }
}
