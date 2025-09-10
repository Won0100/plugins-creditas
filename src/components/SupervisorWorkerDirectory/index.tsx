import { ITask, WorkerDirectoryTabs } from "@twilio/flex-ui";
import { util } from "helpers/util";
import { FC, useEffect } from "react";
import {
  HiddenFlexQueueChannel,
  readHiddenFlexQueuesDocument,
} from "services/sync/hiddenWorkerDirectoryQueues";

interface WorkerDirectoryProps {
  uniqueName: string;
  icon?: string;
  label?: string;
  task?: ITask;
  taskSid?: string;
}

export const SupervisorWorkerDirectoryTab: FC<WorkerDirectoryProps> = (
  props
) => {
  async function hiddenFlexQueues() {
    const queuesToHidden = await readHiddenFlexQueuesDocument();

    WorkerDirectoryTabs.defaultProps.queueFilter = (queue) => {
      const reservationSid = util.getReservationFromUrl();

      if (!reservationSid || !queuesToHidden || !props.task) {
        return true;
      }

      const queuesToHiddenBasedOnChannel =
        queuesToHidden[
          props.task.taskChannelUniqueName as HiddenFlexQueueChannel
        ];

      if (!queuesToHiddenBasedOnChannel) {
        return true;
      }

      return queuesToHiddenBasedOnChannel.includes(queue.queueSid);
    };
  }

  useEffect(() => {
    hiddenFlexQueues();
  }, [props.taskSid]);

  return <WorkerDirectoryTabs />;
};
