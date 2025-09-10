import { HiddenFlexQueueChannel } from "services/sync/hiddenWorkerDirectoryQueues";

export type ReadHiddenWorkerDirectoryQueuesDocumentReturn = {
  [HiddenFlexQueueChannel.Chat]: string[];
  [HiddenFlexQueueChannel.Voice]: string[];
};
