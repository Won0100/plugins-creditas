import { Actions } from "@twilio/flex-ui";

import {
  handleBeforeHangupCall,
  handleBeforeCompleteTask,
  handleBeforeWrapupTask,
  handleAfterMonitorCall,
  handleAfterStopMonitoringCall,
  handleAfterLogout,
  handleBeforeSetWorkerActivity,
  handleBeforeTransferTask,
  handleBeforeShowDirectory,
} from "./handlers/";

interface SmsModalControlPayload {
  url: string;
}

interface CustomEventWithUrl extends Event {
  url?: string;
}

export const registerActions = (): void => {
  Actions.registerAction(
    "smsModalControl",
    (payload: SmsModalControlPayload) => {
      const event: CustomEventWithUrl = new Event(
        "smsModalControlOpen"
      ) as CustomEventWithUrl;
      event.url = payload.url;
      document.dispatchEvent(event);
      return Promise.resolve();
    }
  );
};

export const registerActionsEventHandlers = () => {
  handleBeforeHangupCall();
  handleBeforeCompleteTask();
  handleBeforeWrapupTask();
  handleAfterMonitorCall();
  handleAfterStopMonitoringCall();
  handleAfterLogout();
  handleBeforeSetWorkerActivity();
  handleBeforeTransferTask();
  handleBeforeShowDirectory();
};
