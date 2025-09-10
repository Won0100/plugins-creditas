import { Manager, Actions, Notifications } from "@twilio/flex-ui";
import { transferTask } from "../services/transferTask";
import { onStartOutboundCall } from "../helpers/onStartOutboundCall";
import { userInstance } from "services/manager/user";

import { workerDialerConfigDocument } from "../services/sync/workerDialerConfig";

export const replaceActions = async () => {
  const {
    userType,
    updateActivityConfig,
    getWorkerSyncDocumentUniqueName,
    checkRoleCustom,
  } = userInstance;

  Actions.replaceAction("TransferTask", (payload, original) =>
    transferTask.transferInteraction(payload, original)
  );

  Actions.replaceAction(
    "SelectWorkerInSupervisor",
    async (payload, original) => {
      if (
        checkRoleCustom("supervisor") ||
        checkRoleCustom("admin") ||
        userType("admin")
      ) {
        await original(payload);
      }
    }
  );

  const activitiesToCall = [
    "Disponível",
    "Em Atendimento",
    "Ligação OGM",
    "Retorno de Ligacao",
  ];

  Actions.replaceAction("StartOutboundCall", async (payload, original) => {
    payload.taskAttributes = {
      customerAddress: payload.destination,
    };

    if (
      !activitiesToCall.includes(
        Manager.getInstance().workerClient?.activity?.name ?? ""
      )
    ) {
      return Notifications.showNotification("startCallBlocked");
    }

    const workerSid = Manager.getInstance().workerClient?.workerSid;
    const workerDialerConfig = await workerDialerConfigDocument.getWorkerIdAndDestNumbers("worker-dialer-config", workerSid ?? "", payload.destination);

    if(workerDialerConfig) {  
      payload.workerDialerConfig = workerDialerConfig;
    }

    const response = await onStartOutboundCall(payload);

    original(response)
  });

  Actions.replaceAction("SetActivity", async (payload, original) => {
    const { status, message } = await updateActivityConfig(
      payload.activityName,
      getWorkerSyncDocumentUniqueName(),
      "agent"
    );
    if (status === "cancelAction") {
      const notification = Notifications.registeredNotifications.get(
        "activityBlockedToUse"
      );
      if (notification) {
        notification.content = message;
        Notifications.showNotification("activityBlockedToUse");
      }
      return;
    }

    userInstance.dispatch({
      type: "UPDATE_LAST_ACTIVITY",
      payload: payload.activityName,
    });

    await original(payload);
  });

  Actions.replaceAction("Logout", async (payload, original) => {
    const { status, message } = await updateActivityConfig(
      userInstance.getDefaultOfflineActivity(),
      getWorkerSyncDocumentUniqueName(),
      "agent"
    );
    if (status === "cancelAction") {
      const notification = Notifications.registeredNotifications.get(
        "activityBlockedToUse"
      );
      if (notification) {
        notification.content = message;
        Notifications.showNotification("activityBlockedToUse");
      }
      return;
    }

    userInstance.dispatch({
      type: "UPDATE_LAST_ACTIVITY",
      payload: userInstance.getDefaultOfflineActivity(),
    });

    await original(payload);
  });
};
