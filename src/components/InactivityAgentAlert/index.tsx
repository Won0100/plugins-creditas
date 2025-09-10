import {
  Actions,
  ConversationHelper,
  TaskHelper,
  NotificationBar,
  Notifications,
} from "@twilio/flex-ui";
import { TaskListItemChildrenProps } from "@twilio/flex-ui/src/components/TaskList/TaskListItem/TaskListItem.definitions";
import { TaskCardChildrenProps } from "@twilio/flex-ui/src/components/supervisor/TaskCardList/TaskCard/TaskCard.definitions";
import React, { useEffect, useState } from "react";
import { userInstance } from "services/manager/user";
import { InactivityAgentAlertWrapper } from "./styled";
import { util } from "helpers/util";
import { TaskrouterService } from "services/taskrouter";

type InactivityAgentAlertProps =
  | {
      OriginalComponent: React.ComponentType<TaskListItemChildrenProps>;
      props: TaskListItemChildrenProps;
      componentScreen?: "agent";
    }
  | {
      OriginalComponent: React.ComponentType<TaskCardChildrenProps>;
      props: TaskCardChildrenProps;
      componentScreen?: "supervisor";
    };

export const InactivityAgentAlert: React.FC<InactivityAgentAlertProps> = ({
  OriginalComponent,
  props,
  componentScreen,
}) => {
  const [showAlert, setShowAlert] = useState(false);

  const notificationHandler = () => {
    const alertNotification = Notifications.registeredNotifications.get(
      "inactivityAgentAlert"
    );

    if (alertNotification) {
      alertNotification.actions = [
        <NotificationBar.Action
          label="Ver agora"
          onClick={() => {
            Actions.invokeAction("SelectTask", { sid: props.task?.sid });

            Notifications.dismissNotificationById("inactivityAgentAlert");
          }}
        />,
      ];
      alertNotification.content = `A tarefa ${
        props.task?.attributes?.name || props.task?.sid
      } está um tempo sem resposta e precisa da sua atenção`;

      Notifications.showNotificationSingle("inactivityAgentAlert");
    }
  };

  const validateTaskOwner = () => {
    const worker = userInstance.getWorkerClient();
    const task = props.task;

    if (task && util.checkAgentIsOwnerOfTask(task)) {
      const helper = new ConversationHelper(props?.conversation!);

      if (task.workerSid === worker!.sid && !helper?.lastMessage?.isFromMe) {
        notificationHandler();
      }
    }
  };

  useEffect(() => {
    const handleAgentInactivityAlert = (
      taskAttributes: Record<string, any>
    ) => {
      if (taskAttributes?.agentInactivityCount) {
        validateTaskOwner();
        setShowAlert(() => true);
      } else {
        setShowAlert(() => false);
      }
    };

    async function getUpdatedTask() {
      const taskrouterService = new TaskrouterService();

      const result = await taskrouterService.getTaskBySid(props.task?.taskSid!);

      if (result.success) {
        const taskAttributes = JSON.parse(result.data.attributes);

        handleAgentInactivityAlert(taskAttributes);
      }
    }

    const task = props?.task;

    if (util.checkAgentIsOwnerOfTask(task)) {
      const conversationSid = props?.conversation?.source?.sid;

      if (conversationSid) {
        const taskUpdated =
          TaskHelper.getTaskFromConversationSid(conversationSid);

        handleAgentInactivityAlert(taskUpdated?.attributes!);
      }
    } else if (task) {
      getUpdatedTask();
    }
  }, [props.task]);

  switch (componentScreen) {
    case "agent": {
      return (
        <InactivityAgentAlertWrapper showAlert={showAlert}>
          <OriginalComponent {...props} />
        </InactivityAgentAlertWrapper>
      );
    }
    case "supervisor": {
      return (
        <InactivityAgentAlertWrapper showAlert={showAlert}>
          <OriginalComponent {...props} />
        </InactivityAgentAlertWrapper>
      );
    }
    default: {
      return <div>Not implemented</div>;
    }
  }
};
