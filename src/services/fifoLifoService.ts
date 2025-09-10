// FIFO/LIFO queue order service

export type QueueOrder = 'FIFO' | 'LIFO';

import { userInstance } from "./manager/user";

export async function updateQueueOrder(queueSid: string, taskOrder: QueueOrder) {
  try {
    console.log("[FifoLifoService] Updating queue order:", {
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
    console.log("[FifoLifoService] Queue updated successfully:", result);
    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    console.error("[FifoLifoService] Error updating queue order:", {
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