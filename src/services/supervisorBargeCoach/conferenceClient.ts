import { Manager } from '@twilio/flex-ui';

//import { logger, notifications } from '../utils';
//import { notifications } from '../utils';

class ConferenceClient {
  private manager: Manager;

  constructor(manager: Manager) {
    this.manager = manager;
  }

  /**
   * Internal method to make a POST request
   * @param path  the path to post to
   * @param params the post parameters
   */
  private post = async (path: string, params: any, errorNotification: string) => {
    const body = {
      ...params,
      Token: this.manager.store.getState().flex.session.ssoTokenPayload.token,
    };

    const options = {
      method: 'POST',
      body: new URLSearchParams(body),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };

    try {
      const resp = await fetch(`${process.env.FLEX_APP_API_BASE_URL}/supervisor-barge-coach/${path}`, options);
      return resp.json();
    } catch (e) {
      //notifications.error(errorNotification);
      throw e;
    }
  };

  /*
   * We are calling the mute-unmute-participant Twilio Function passing the conferenceSid, the participantSid, and
   * flip them from mute/unmute respectively when clicking the button
   */
  private toggleParticipantMute = async (conferenceSid: string, participantSid: string, muted: boolean) => {
    const action = muted ? 'Muting' : 'Unmuting';
    //logger.log(`${action} participant on conference ${conferenceSid} with supervisor ${participantSid}`);

    await this.post(
      'mute-unmute-participant',
      {
        conferenceSid,
        participantSid,
        muted,
      },
      `Could not ${muted ? 'mute' : 'unmute'} participant. Please try again later.`,
    );
    //logger.log(`${action} successful for participant`, participantSid);
  };

  /*
   * We are calling the coaching Twilio function passing the conferenceSid, the participantSid, and
   * flip them from disable/enable coaching respectively when clicking the button
   */
  private toggleParticipantCoaching = async (conferenceSid: string, participantSid: string, coaching: boolean, agentSid: string) => {
    const action = coaching ? 'Enabling Coach' : 'Disabling Coach';
    //logger.log(`${action} on conference ${conferenceSid} between coach ${participantSid} and agent ${agentSid}`);

    await this.post(
      'coaching',
      {
        conferenceSid,
        participantSid,
        coaching,
        agentSid,
      },
      `Could not ${coaching ? 'enable' : 'disable'} coaching. Please try again later.`,
    );

    //logger.log(`${action} successful for participant`, participantSid);
  };

  /**
   * Calling to toggle mute status to true (mute)
   * @param conferenceSid the conference to unmute
   * @param participantSid the participantSid (the supervisor)
   */
  muteParticipant = async (conferenceSid: string, participantSid: string) => {
    return this.toggleParticipantMute(conferenceSid, participantSid, true);
  };

  /**
   * Calling to toggle mute status to false (unmute)
   * @param conferenceSid the conference to unmute
   * @param participantSid the participantSid (the supervisor)
   */
  unmuteParticipant = async (conferenceSid: string, participantSid: string) => {
    return this.toggleParticipantMute(conferenceSid, participantSid, false);
  };

  /**
   *  Calling to toggle coaching status to true (enable coaching) and toggle mute to false
   * @param conferenceSid the conference to disable coaching on
   * @param participantSid the participantSid (the supervisor)
   * @param agentSid the agentSid
   */
  enableCoaching = async (conferenceSid: string, participantSid: string, agentSid: string) => {
    return this.toggleParticipantCoaching(conferenceSid, participantSid, true, agentSid);
  };

  /**
   * Calling to toggle coaching status to false (disable coaching) and toggle mute to true
   * @param conferenceSid the conference to disable coaching on
   * @param participantSid the participantSid (the supervisor)
   * @param agentSid the agentSid
   */
  disableCoaching = async (conferenceSid: string, participantSid: string, agentSid: string) => {
    return this.toggleParticipantCoaching(conferenceSid, participantSid, false, agentSid);
  };
}

const conferenceClient = new ConferenceClient(Manager.getInstance());

export default conferenceClient;
