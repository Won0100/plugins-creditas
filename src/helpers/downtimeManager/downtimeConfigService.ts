import api from "../../services/api";

type RequestProps = {
  downtimeConfig?: string;
};

const request = async (path: string, params?: RequestProps) => {
  const body = {
    data: params,
    method: "POST",
  };

  return api(`downtime-manager/${path}`, body);
};

export const createDowntimeConfigMutex = async () => {
  return request("create-downtime-config-mutex");
};

export const releaseDowntimeConfigMutex = async () => {
  return request("release-downtime-config-mutex");
};

export const updateDowntimeConfig = async (downtimeConfig: any) => {
  return request("update-downtime-config", {
    downtimeConfig: JSON.stringify(downtimeConfig),
  });
};
export const hasCreatedDowntimeConfigMutex = async () => {
  return request("check-downtime-config-mutex");
};

export const fetchTimezoneList = async () => {
  return ["America/Sao_Paulo"];
};
