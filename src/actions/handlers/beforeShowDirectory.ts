import { Actions, TaskHelper, WorkerDirectory } from "@twilio/flex-ui";
import { util } from "helpers/util";
import {
  HiddenFlexQueueChannel,
  readHiddenFlexQueuesDocument,
} from "services/sync/hiddenWorkerDirectoryQueues";

export const handleBeforeShowDirectory = () => {
  Actions.addListener("beforeShowDirectory", async () => {
    const queuesToHidden = await readHiddenFlexQueuesDocument();

    WorkerDirectory.Tabs.defaultProps.queueFilter = (queue) => {
      const reservationSid = util.getReservationFromUrl();
      if (!reservationSid || !queuesToHidden) {
        return true;
      }

      const task = TaskHelper.getTaskByTaskSid(reservationSid);

      const queuesToHiddenBasedOnChannel =
        queuesToHidden[task.taskChannelUniqueName as HiddenFlexQueueChannel];

      if (!queuesToHiddenBasedOnChannel) {
        return true;
      }

      return queuesToHiddenBasedOnChannel.includes(queue.queueSid);
    };
  });
};
