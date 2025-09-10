import {
  Actions,
  TaskHelper,
  Manager,
  Notifications,
  StateHelper,
  ActionFunction,
} from "@twilio/flex-ui";
import api from "../services/api";

interface TransferTaskPayload {
  task: any;
  targetSid: string;
}

type RequestDataProps = {
  interactionSid: string;
  channelSid: string;
  taskChannelUniqueName: string;
  taskAttributes: any;
  taskSid: string;
  targetSid: string;
  workerName: string;
};

const request = async (path: string, data?: RequestDataProps) => {
  const params = {
    method: "POST",
    data,
  };

  return api(path, params);
};

export const transferTask = {
  async transferInteraction(
    payload: TransferTaskPayload,
    original: ActionFunction
  ): Promise<void> {
    if (!TaskHelper.isChatBasedTask(payload.task)) {
      return original(payload);
    }

    const manager = Manager.getInstance();

    const body = {
      interactionSid: payload.task.attributes.flexInteractionSid,
      channelSid: payload.task.attributes.flexInteractionChannelSid,
      taskChannelUniqueName: payload.task.taskChannelUniqueName,
      taskAttributes: payload.task.attributes,
      taskSid: payload.task.taskSid,
      targetSid: payload.targetSid,
      workerName: manager.user.identity,
    };

    try {
      const data = await request(
        "/transfer-interaction/transfer-interaction",
        body
      );

      if (data.status === 200) {
        Notifications.showNotification("transferredNotification");
      } else {
        const notification = Notifications.registeredNotifications.get(
          "errorTransferredNotification"
        );

        if (notification) {
          notification.content =
            data.data?.message || "Erro para transferir atendimento";

          Notifications.showNotification("errorTransferredNotification");
        }
      }

      return;
    } catch (error: any) {
      Notifications.showNotification("errorTransferredNotification", {
        message: error.message,
      });

      const channel = StateHelper.getConversationStateForTask(payload.task);
      if (channel) {
        await channel.source?.join();
      }

      Actions.invokeAction("ReloadWindow");
    }
  },
};
