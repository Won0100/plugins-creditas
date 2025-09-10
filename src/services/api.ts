import { Actions, Manager } from "@twilio/flex-ui";

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const api = async (
  path: string,
  extra?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const manager = Manager.getInstance();

  const requestConfig: AxiosRequestConfig = {
    baseURL:
      process.env.FLEX_APP_API_BASE_URL ||
      manager.serviceConfiguration.attributes.api_base_url,
    url: path,
    ...extra,
    params: {
      ...extra?.params,
      Token: manager.user.token,
    },
  };

  let response: any;

  try {
    response = await axios(requestConfig);
  } catch (err: any) {
    if (err.response) {
      const { status, data } = err.response;

      if (
        status === 401 &&
        (data?.message === "Token is invalid" ||
          data?.message === "Error validating Flex token")
      ) {
        await Actions.invokeAction("Logout", { forceLogout: true });
      }
    }
    throw err;
  }

  return response;
};

export default api;
