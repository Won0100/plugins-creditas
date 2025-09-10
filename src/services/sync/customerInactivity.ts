import { readMap } from "services/syncClient";
import {
  CustomerInactivityMap,
  CustomerInactivityMapWithKey,
  ReadCustomerInactivityMapReturn,
} from "types/customer";

export const readCustomerInactivityMap = async (teamId?: string) => {
  try {
    const customerInactivityMap = await readMap("customer_inactivity");

    try {
      const timerInformation = await customerInactivityMap.get(
        teamId || "default"
      );

      const timer = timerInformation.data as CustomerInactivityMap;

      return {
        mapKey: timerInformation.key,
        timer: timer.timer,
      } as ReadCustomerInactivityMapReturn;
    } catch (err: any) {
      if (err.message?.includes("does not exist")) {
        const defaultAlertInformation = await customerInactivityMap.get(
          "default"
        );

        const timer = defaultAlertInformation.data as CustomerInactivityMap;

        return {
          mapKey: defaultAlertInformation.key,
          timer: timer.timer,
        } as ReadCustomerInactivityMapReturn;
      }
      console.warn("Error to fetch customer inactivity map", err);
    }
  } catch (err) {
    console.warn("Error to handle with customer inactivity map", err);
  }
};

export const readMapData = async (convertToArray?: boolean) => {
  const mapData = await readMap("customer_inactivity");

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

    return formatted as CustomerInactivityMapWithKey[];
  }
};

export const updateMap = async (data: CustomerInactivityMapWithKey[]) => {
  try {
    const mapData = await readMap("customer_inactivity");

    const validateData = data.find(
      (item) => item.timer <= 0 || typeof item.timer !== "number"
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
          timer: item.timer,
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
    console.warn(
      "Error to update map on customer inactivity page",
      err.message
    );

    return {
      success: false,
      message: err.message,
    };
  }
};
