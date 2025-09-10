import { Manager } from "@twilio/flex-ui";

import axios, { AxiosInstance } from "axios";

export enum GetWorkerByTaskAttributesFilterType {
  CUSTOMER_PHONE = "customerPhone",
  CUSTOMER_NAME = "customerName",
}

interface GetWorkerByTaskAttributesProps {
  filterType: GetWorkerByTaskAttributesFilterType;
  filterValue: string;
}

export class ServerlessApiInstance {
  private apiAxiosInstance: AxiosInstance;

  constructor() {
    const manager = Manager.getInstance();

    this.apiAxiosInstance = axios.create({
      baseURL:
        process.env.FLEX_APP_API_BASE_URL ||
        manager.serviceConfiguration.attributes.api_base_url,
      params: {
        Token: manager.user.token,
      },
    });
  }

  async getWorkerByTaskAttributes({
    filterType,
    filterValue,
  }: GetWorkerByTaskAttributesProps) {
    try {
      const { data } = await this.apiAxiosInstance.post(
        "/utils/get-worker-by-task-attributes",
        {
          filterType,
          filterValue,
        }
      );

      if (!data.success) {
        throw {
          message: "Error to fetch worker by task attributes",
          detail: data,
        };
      }

      return data.data;
    } catch (err) {
      console.warn("Error to fetch worker by task attributes", err);
      return {};
    }
  }
}
