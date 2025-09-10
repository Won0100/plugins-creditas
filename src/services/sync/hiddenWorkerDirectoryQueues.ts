import { readDocument, readDocumentData } from "services/syncClient";
import { ReadHiddenWorkerDirectoryQueuesDocumentReturn } from "types/taskQueues";

const DOCUMENT_UNIQUE_NAME = "hidden-flex-queues";

export enum HiddenFlexQueueChannel {
  Voice = "voice",
  Chat = "chat",
}

export const readHiddenFlexQueuesDocument = async () => {
  try {
    const hiddenFlexQueuesDocument =
      await readDocumentData<ReadHiddenWorkerDirectoryQueuesDocumentReturn>(
        DOCUMENT_UNIQUE_NAME
      );

    return hiddenFlexQueuesDocument;
  } catch (err: any) {
    console.warn("Error to get hidden flex queues document", err.message);
  }
};

export const updateHiddenFlexQueuesDocument = async (
  channel: HiddenFlexQueueChannel,
  data: ReadHiddenWorkerDirectoryQueuesDocumentReturn
) => {
  try {
    const hiddenFlexQueuesDocument = await readDocument(DOCUMENT_UNIQUE_NAME);

    const validateData = data[channel];

    if (!validateData || !validateData.length) {
      return {
        success: false,
        message: `Você precisa definir pelo menos 1 fila para o canal ${channel}`,
      };
    }

    await hiddenFlexQueuesDocument.update({
      ...hiddenFlexQueuesDocument.data,
      [channel]: validateData,
    });

    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
};
