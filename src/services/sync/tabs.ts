import { Manager } from "@twilio/flex-ui";
import { readDocument, readDocumentData } from "services/syncClient";
import { TabsType } from "../../types/tabs";

const manager = Manager.getInstance();
const uniqueName = `tabs-${manager.serviceConfiguration.account_sid}`;

export const tabsDocument = {
  get: async (): Promise<TabsType | undefined> => {
    try {
      const document = await readDocumentData<TabsType>(uniqueName);

      return document;
    } catch (err: any) {
      console.error("tabsDocument.get: ", err.message);
    }
  },
  update: async (payload: TabsType) => {
    try {
      const document = await readDocument(uniqueName);

      const documentUpdated = await document.update(payload);

      return documentUpdated;
    } catch (err: any) {
      console.error("tabsDocument.update: ", err.message);
    }
  },
};
