import { requestUrlEncoded } from "../requestUrlEncoded";
import { ServiceSyncListType } from "../../types/sync";
import { Manager } from "@twilio/flex-ui";
import {
  ActivitiesSyncType,
  TeamsActivitiesDataType,
} from "../../types/activities";
import defaultActivityFlagColor from "assets/defaultConfigs/activity-flag-color.json";

const manager = Manager.getInstance();
const uniqueName = `activity-${manager.serviceConfiguration.account_sid}`;
const url = `https://sync.twilio.com/v1/Services/${
  manager.serviceConfiguration.attributes?.sync_service_sid ||
  process.env.FLEX_APP_SYNC_SERVICE_SID
}/Lists`;

interface DocumentDataType extends ServiceSyncListType {
  data: ActivitiesSyncType;
}

type ItemsListType = {
  items: DocumentDataType[];
};

export const activityPanelList = {
  get: async (): Promise<TeamsActivitiesDataType[]> => {
    try {
      const checkList = await activityPanelList.checkList();

      if (!checkList) return [{ data: defaultActivityFlagColor }];

      const response: ItemsListType = await requestUrlEncoded(
        "get",
        `${url}/${uniqueName}/Items`
      );

      if (response?.items?.length > 0) {
        const data: TeamsActivitiesDataType[] = [];

        for (const item of response.items) {
          data.push({
            index: item.index,
            data: item.data,
          });
        }

        if (!data.some((activity) => activity.data["Padrão"])) {
          data.push({
            data: defaultActivityFlagColor,
          });
        }

        return data;
      } else {
        return [{ data: defaultActivityFlagColor }];
      }
    } catch (err) {
      if (err instanceof Error)
        console.error("activityPanelList.get: ", err.message);

      return [{ data: defaultActivityFlagColor }];
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

      if (response?.list_sid) {
        return response;
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error("activityPanelList.create: ", err.message);
    }
  },
  createIndex: async (payload: ActivitiesSyncType) => {
    try {
      const checkList = await activityPanelList.checkList();
      if (!checkList) return;

      const response: DocumentDataType = await requestUrlEncoded(
        "post",
        `${url}/${uniqueName}/Items`,
        {},
        { Data: JSON.stringify(payload) }
      );

      if (response.data) {
        const data: TeamsActivitiesDataType = {
          index: response.index,
          data: response.data,
        };

        return data;
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error("activityPanelList.createIndex: ", err.message);
    }
  },
  updateIndex: async (payload: TeamsActivitiesDataType) => {
    try {
      const checkList = await activityPanelList.checkList();
      if (!checkList) return;

      const response: DocumentDataType = await requestUrlEncoded(
        "post",
        `${url}/${uniqueName}/Items/${payload.index}`,
        {},
        { Data: JSON.stringify(payload.data) }
      );

      if (response.data) {
        const data: TeamsActivitiesDataType = {
          index: response.index,
          data: response.data,
        };

        return data;
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error("activityPanelList.createIndex: ", err.message);
    }
  },
  checkList: async () => {
    const response: ItemsListType = await requestUrlEncoded(
      "get",
      `${url}/${uniqueName}/Items`
    );

    if (!response?.items) {
      const createList = await activityPanelList.create();

      createList && createList.list_sid ? true : false;
    }

    return true;
  },
};
