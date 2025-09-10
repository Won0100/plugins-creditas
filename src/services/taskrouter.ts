import axios, { AxiosInstance } from "axios";
import { userInstance } from "./manager/user";

export class TaskrouterService {
  private twilioAxiosInstance: AxiosInstance;

  constructor() {
    const manager = userInstance.getInstance();
    const {
      account_sid,
      attributes: { auth_token },
      taskrouter_workspace_sid,
    } = manager.serviceConfiguration;

    this.twilioAxiosInstance = axios.create({
      baseURL: `https://taskrouter.twilio.com/v1/Workspaces/${taskrouter_workspace_sid}`,
      auth: {
        username: account_sid,
        password: auth_token,
      },
    });
  }

  async getTaskBySid(sid: string) {
    try {
      const result = await this.twilioAxiosInstance.get(`/Tasks/${sid}`);

      if (result.status !== 200) {
        throw {
          message: "Error to fetch task",
          detail: result.data,
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (err: any) {
      console.warn("Error to fetch task on Twilio", err);
      return {
        success: false,
        message: err.message,
      };
    }
  }


  async updateQueueOrder(queueSid: string, taskOrder: 'FIFO' | 'LIFO') {
    try {
      console.log("[TaskrouterService] Updating queue order:", {
        queueSid,
        taskOrder
      });

      const workspaceSid = userInstance.getInstance().serviceConfiguration.taskrouter_workspace_sid;
      if (!workspaceSid) {
        throw new Error("Workspace SID not found");
      }

      // Get credentials from Flex context
      const accountSid = userInstance.getInstance().serviceConfiguration.account_sid;
      const authToken = userInstance.getInstance().serviceConfiguration.attributes.auth_token;

      // Prepare Basic Auth header
      const authHeader = "Basic " + btoa(`${accountSid}:${authToken}`);

      // Prepare the request body
      const body = new URLSearchParams({ TaskOrder: taskOrder });

      // Call Twilio REST API directly
      const response = await fetch(
        `https://taskrouter.twilio.com/v1/Workspaces/${workspaceSid}/TaskQueues/${queueSid}`,
        {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update queue order");
      }

      const result = await response.json();
      console.log("[TaskrouterService] Queue updated successfully:", result);
      return {
        success: true,
        data: result,
      };
    } catch (err: any) {
      console.error("[TaskrouterService] Error updating queue order:", {
        error: err,
        message: err.message,
        stack: err.stack,
        queueSid,
        taskOrder
      });
      return {
        success: false,
        message: err.message,
      };
    }
  }

}
