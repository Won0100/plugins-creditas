import { Manager } from "@twilio/flex-ui";
import { OpenMode, SyncClient } from "twilio-sync";

const SYNC_CLIENT = new SyncClient(Manager.getInstance().user.token);

export const readDocumentData = async <T = any>(
  uniqueName: string
): Promise<T> => {
  const document = await readDocument(uniqueName);

  return document.data as T;
};

export const readDocument = async (uniqueName: string, mode?: OpenMode) => {
  return SYNC_CLIENT.document({ id: uniqueName, ...(mode && { mode }) });
};

export const readMap = async (uniqueName: string) => {
  return SYNC_CLIENT.map(uniqueName);
};
