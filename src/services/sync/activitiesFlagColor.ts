import { requestUrlEncoded } from "../requestUrlEncoded";
import { ServiceSyncType } from "../../types/sync";
import { Manager } from "@twilio/flex-ui";
import { ActivityColorType } from "../../types/activities";

const manager = Manager.getInstance();
const uniqueName = `activity-flag-color-${manager.serviceConfiguration.account_sid}`;
const url = `https://sync.twilio.com/v1/Services/${
  manager.serviceConfiguration.attributes?.sync_service_sid ||
  process.env.FLEX_APP_SYNC_SERVICE_SID
}/Documents`;

interface DocumentDataType extends ServiceSyncType {
  data: ActivityColorType;
}

export const activitiesFlagColorDocument = {
  get: async () => {
    try {
      const response: DocumentDataType = await requestUrlEncoded(
        "get",
        `${url}/${uniqueName}`
      );

      if (response) {
        const document = response;

        if (document) {
          return document;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error("activitiesFlagColorDocument.get: ", err.message);
    }
  },
  update: async (payload: ActivityColorType) => {
    try {
      const getDocument = await activitiesFlagColorDocument.get();
      let response: DocumentDataType | undefined;

      if (getDocument) {
        response = await requestUrlEncoded(
          "post",
          `${url}/${getDocument.sid}`,
          {},
          { Data: JSON.stringify(payload) }
        );
      } else {
        const create = await activitiesFlagColorDocument.create();

        if (create && create?.unique_name === uniqueName) {
          response = await requestUrlEncoded(
            "post",
            `${url}/${create.sid}`,
            {},
            { Data: JSON.stringify(payload) }
          );
        }
      }

      return response;
    } catch (err) {
      if (err instanceof Error)
        console.error("activitiesFlagColorDocument.update: ", err.message);
    }
  },
  create: async () => {
    try {
      const response: DocumentDataType = await requestUrlEncoded(
        "post",
        url,
        {},
        { UniqueName: uniqueName }
      );

      if (response?.sid) {
        return response;
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error("activitiesFlagColorDocument.create: ", err.message);
    }
  },
};
