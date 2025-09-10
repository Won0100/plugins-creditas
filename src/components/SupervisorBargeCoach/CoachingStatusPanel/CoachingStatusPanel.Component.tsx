import React from 'react';

import AbstractSyncComponent, { CallbackListenerParams } from '../AbstractSyncComponent';
import { Status } from './CoachingStatusPanel.Style';
import { CoachingStatusPanelConnectedProp } from './index';
import { SupervisorData } from 'types/supervisorBargeCoach/supervisorData';

export default class CoachingStatusPanel extends AbstractSyncComponent<CoachingStatusPanelConnectedProp> {
  private listenerAdded = false;

  onDocUpdated = (doc: CallbackListenerParams[0]) => {
    const supervisorArray: SupervisorData[] = !doc.data?.data?.supervisors ? [] : [...doc.data.data.supervisors];
    this.props.setBargeCoachStatus({ supervisorArray });
  };

  componentDidUpdate = async () => {
    if (!this.listenerAdded && this.props.myWorkerSid) {
      this.listenerAdded = true;
      await this.setupListener(`syncDoc.${this.props.myWorkerSid}`, this.onDocUpdated);
    }
  };

  render() {
    const { supervisorArray } = this.props;

    if (supervisorArray.length === 0) {
      return <Status />;
    }

    return (
      <Status>
        <div>
          Você está sendo assistido por:
          <h1 style={{ color: 'green' }}>
            <ol>
              {supervisorArray.map((arr) => (
                <li key={arr.supervisor}>{arr.supervisor}</li>
              ))}
            </ol>
          </h1>
        </div>
      </Status>
    );
  }
}
