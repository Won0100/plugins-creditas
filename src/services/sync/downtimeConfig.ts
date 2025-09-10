import { readMap } from "services/syncClient";

const MAP_UNIQUE_NAME = "downtime_config";

export const readDowntimeConfigMap = async (queueName?: string) => {
  try {
    const agentInactivityAgentInactivityMap = await readMap(MAP_UNIQUE_NAME);

    try {
      const downtimeConfigItem = await agentInactivityAgentInactivityMap.get(
        queueName || "Everyone"
      );

      const downtimeConfig = downtimeConfigItem.data;

      return downtimeConfig as any;
    } catch (err: any) {
      console.warn("Error to fetch alert sync", err);
    }
  } catch (err) {
    console.warn("Error to handle with sync map", err);
  }
};
