import { Notifications, NotificationType } from "@twilio/flex-ui";

export const setUpNotifications = () => {
  Notifications.registerNotification({
    id: "inactivityAgentAlert",
    type: NotificationType.warning,
    content: "",
    timeout: 10000,
  });

  Notifications.registerNotification({
    id: "transferredNotification",
    closeButton: true,
    content: "Tarefa transferida com sucesso!",
    timeout: 10000,
    type: NotificationType.success,
  });

  Notifications.registerNotification({
    id: "errorTransferredNotification",
    closeButton: true,
    timeout: 10000,
    content: "",
    type: NotificationType.error,
  });

  Notifications.registerNotification({
    id: "recordAudioError",
    content:
      "Para usar a gravação de áudio você precisa permitir que o Flex use seu microfone",
    type: NotificationType.error,
    timeout: 5000,
  });

  Notifications.registerNotification({
    id: "activityBlockedToUse",
    type: NotificationType.warning,
    timeout: 5000,
  });

  Notifications.registerNotification({
    id: "startCallBlocked",
    content: "Atividade não permitida para realizar chamadas ativas",
    type: NotificationType.warning,
    timeout: 5000,
  });

  Notifications.registerNotification({
    id: "SelectOutcome",
    content: "WrapUpSelectOutcomeNotification",
    closeButton: true,
    timeout: 3000,
    type: NotificationType.warning,
  });
};
