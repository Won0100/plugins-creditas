import { readMap } from "services/syncClient";
import {
  AgentInactivityMap,
  AgentInactivityMapWithKey,
  ReadAgentInactivityMapReturn,
} from "types/worker";

export const readWorkerInactivityAgentInactivityMap = async (
  teamId?: string
) => {
  try {
    const agentInactivityAgentInactivityMap = await readMap(
      "worker_inactivity_alerts"
    );

    try {
      const alertInformation = await agentInactivityAgentInactivityMap.get(
        teamId || "default"
      );

      const alertData = alertInformation.data as AgentInactivityMap;

      return {
        alertMapKey: alertInformation.key,
        alerts: { ...alertData },
      } as ReadAgentInactivityMapReturn;
    } catch (err: any) {
      if (err.message?.includes("does not exist")) {
        const defaultAlertInformation =
          await agentInactivityAgentInactivityMap.get("default");

        const alertData = defaultAlertInformation.data as AgentInactivityMap;

        return {
          alertMapKey: defaultAlertInformation.key,
          alerts: { ...alertData },
        } as ReadAgentInactivityMapReturn;
      }
      console.warn("Error to fetch alert sync", err);
    }
  } catch (err) {
    console.warn("Error to handle with sync map", err);
  }
};

export const readMapData = async (convertToArray?: boolean) => {
  const mapData = await readMap("worker_inactivity_alerts");

  const mapItems = await mapData.getItems();

  if (convertToArray) {
    const formatted = mapItems.items
      .map((item) => {
        const { data, key } = item;

        return {
          key,
          ...data,
        };
      })
      .sort((a, b) => (a.key === "default" ? -1 : 1));

    return formatted as AgentInactivityMapWithKey[];
  }
};

export const updateMap = async (data: AgentInactivityMapWithKey[]) => {
  try {
    const mapData = await readMap("worker_inactivity_alerts");

    const validateData = data.find(
      (item) =>
        item.first <= 0 ||
        item.recurrent <= 0 ||
        typeof item.first !== "number" ||
        typeof item.recurrent !== "number"
    );

    if (validateData) {
      return {
        success: false,
        message:
          "O valores dos tempos não podem ser iguais ou menores que 0 ou indefinidos",
      };
    }

    const mapItems = await mapData.getItems();

    const mapItemsToRemove = mapItems.items.filter(
      (item) => !data.find((dataItem) => item.key === dataItem.key)
    );

    await Promise.all([
      data.map(async (item) => {
        await mapData.set(item.key, {
          first: item.first,
          recurrent: item.recurrent,
        });
      }),
      mapItemsToRemove.map(async (item) => {
        await mapData.remove(item.key);
      }),
    ]);

    return {
      success: true,
    };
  } catch (err: any) {
    console.warn("Error to update map on worker inactivity page", err.message);

    return {
      success: false,
      message: err.message,
    };
  }
};

export const deleteMapItem = async (key: string) => {
  try {
    const mapData = await readMap("worker_inactivity_alerts");

    await mapData.remove(key);

    return {
      success: true,
    };
  } catch (err: any) {
    console.warn(
      "Error to delete map item on worker inactivity page",
      err.message
    );

    return {
      success: false,
      message: err.message,
    };
  }
};
