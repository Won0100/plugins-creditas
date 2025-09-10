import { Manager } from "@twilio/flex-ui";
import { readDocument, readDocumentData } from "services/syncClient";

const manager = Manager.getInstance();
const uniqueName = `copilot-queues-${manager.serviceConfiguration.account_sid}`;

export interface ValidQueuesConfig {
  queues: string[];
}

export const validQueuesDocument = {
  get: async (): Promise<ValidQueuesConfig | undefined> => {
    try {
      const document = await readDocumentData<ValidQueuesConfig>(uniqueName);
      return document;
    } catch (err: any) {
      console.error("validQueuesDocument.get: ", err.message);
    }
  },
  
  update: async (payload: ValidQueuesConfig) => {
    try {
      const document = await readDocument(uniqueName);
      const documentUpdated = await document.update(payload);
      return documentUpdated;
    } catch (err: any) {
      console.error("validQueuesDocument.update: ", err.message);
    }
  }
}; 