import * as Flex from "@twilio/flex-ui";
import { WorkerAttributes } from "components/WorkerAttributes";
import { activityFilter } from "flexFilters/activitiesFilter";
import { task } from "helpers/task";
import { userInstance } from "services/manager/user";
import { departmentDocument } from "services/sync/department";
import { CustomCallers } from "../components/CustomCallers";
import { AudioRecorder } from "../components/MessageMedia/AudioRecorder";
import { BubbleMessageWrapper } from "../components/MessageMedia/BubbleMessageWrapper";
import { ImageModal } from "../components/MessageMedia/ImageModal";
import { TransferButton } from "../components/TransferButton";
import { getAreaAgentFilter } from "../flexFilters/areaAgentFilter";
import { getTeamFilter } from "../flexFilters/teamFilter";
import { TaskWithPrivateTask } from "../types/task";
import { AtalhosSelect } from "./AtalhosSelect";
import { Area } from "./ColumnDefinition/Area";
import { Status } from "./ColumnDefinition/Status";
import { Team } from "./ColumnDefinition/Team";
import { SideNavCustom } from "./FlexUI/SideNavCustom";
import { InactivityAgentAlert } from "./InactivityAgentAlert";
import { OldContacts } from "./OldContacts";
import {
  CoachingStatusPanel,
  SupervisorBargeCoachButton,
  SupervisorPrivateModeButton,
} from "./SupervisorBargeCoach";
import { SupervisorWorkerDirectoryTab } from "./SupervisorWorkerDirectory";
import { SwitchTheme } from "./SwitchTheme";
import { TaskInfoPanel } from "./TaskInfoPanel";
import TaskWrapUpForm from "./TaskWrapUpForm";
import { phoneNumberFilter } from "flexFilters/CustomerPhoneFilter";
import { customerNameFilter } from "flexFilters/CustomerNameFilter";
import { CopilotIA } from "./CopilotIA";

import { WhatsappSenderWrapper } from "./WhatsappSender";

export const handleFlexUIComponent = async (getInstance: Flex.Manager) => {
  const { userType, checkRoleCustom, getWorkerClient } = userInstance;

  Flex.SideNav.Content.replace(
    <SideNavCustom key="custom-sidenav" reserveSpace />
  );

  Flex.MainHeader.Content.add(<SwitchTheme key="button-theme-switch" />, {
    align: "end",
    sortOrder: -2,
  });

  Flex.MainHeader.Content.add(<WhatsappSenderWrapper key="whatsapp-sender-header" />, {
    align: "end",
    sortOrder: -1,
  });

  Flex.TaskCanvasTabs.Content.add(
    <OldContacts
      key="old-conversations"
      uniqueName="old-conversations"
      label="Histórico"
    />,
    {
      if: (props) => {
        const channelDefinition = props.channelDefinition.name;
        return (
          channelDefinition === "chat-sms" ||
          channelDefinition === "chat-whatsapp"
        );
      },
    }
  );

  Flex.TaskInfoPanel.Content.replace(<TaskInfoPanel key="task-info-panel" />);
  Flex.Supervisor.TaskInfoPanel.Content.replace(
    <TaskInfoPanel key="supervisor-task-info-panel" />
  );

  if (
    checkRoleCustom("supervisor") ||
    checkRoleCustom("admin") ||
    userType("admin")
  ) {
    Flex.Supervisor.TaskOverviewCanvas.Content.add(
      <SupervisorBargeCoachButton key="barge-coach-buttons" />
    );
    Flex.Supervisor.TaskOverviewCanvas.Content.add(
      <SupervisorPrivateModeButton key="supervisor-private-button" />
    );
  }

  Flex.CallCanvas.Content.add(
    <CoachingStatusPanel key="coaching-status-panel" />,
    {
      sortOrder: -1,
    }
  );

  const [teamFilter, areaAgentFilter] = await Promise.all([
    getTeamFilter(),
    getAreaAgentFilter(),
  ]);

  Flex.TeamsView.defaultProps.filters = [
    activityFilter,
    teamFilter,
    areaAgentFilter,
    phoneNumberFilter,
    customerNameFilter,
  ];

  Flex.WorkersDataTable.Content.add(Status);
  Flex.WorkersDataTable.Content.add(Team);
  Flex.WorkersDataTable.Content.add(Area);

  Flex.QueuesStats.setFilter((queue) => {
    const hiddenQueues = getInstance.serviceConfiguration.attributes
      ?.hiddenQueues as string[];
    return hiddenQueues.filter((item) => item === queue.friendly_name)[0]
      ? false
      : true;
  });

  // Control Panel2 visibility based on copilot_enabled skill
  const manager = Flex.Manager.getInstance();
  const currentWorker = manager.workerClient;
  if (currentWorker) {
    const workerAttributes = currentWorker.attributes;
    const workerSkills = workerAttributes.routing?.skills || [];
    const hasCopilotSkill = workerSkills.includes('copilot_enabled');

    // Add CopilotIA to Panel2 if user has the skill
    if (hasCopilotSkill) {
      Flex.AgentDesktopView.Panel2.Content.replace(
        <CopilotIA key="copilot-ia" />
      );
    } else {
      Flex.AgentDesktopView.defaultProps.showPanel2 = false;
    }
  }

  Flex.Supervisor.TaskCanvasTabs.Content.add(
    <SupervisorWorkerDirectoryTab
      label="Transferir"
      uniqueName="supervisor-task-transfer"
      key="supervisor-transfer-tab"
    />,
    {
      if: () => {
        return checkRoleCustom("supervisor") || checkRoleCustom("admin");
      },
    }
  );

  Flex.TaskCanvasHeader.Content.add(
    <TransferButton key="conversation-transfer-button" />,
    {
      sortOrder: 1,
      if: (props) =>
        props.channelDefinition.capabilities.has("Chat") &&
        props.task.taskStatus === "assigned",
    }
  );

  Flex.MessageBubble.Content.add(<BubbleMessageWrapper key="image" />, {
    if: ({ message: { source } }) => {
      return (
        source &&
        (source.media ||
          source.attributes?.media ||
          source.attributes.contentApiMessage ||
          (source.attributes && source.body === ""))
      );
    },
  });

  Flex.MainContainer.Content.add(<ImageModal key="imageModal" />, {
    sortOrder: 1,
  });

  const handleAtalhosSelect = (value: string) => {
    navigator.clipboard.writeText(value).catch((err) => {
      console.error("Erro ao copiar para área de transferência:", err);
    });
  };

  const [workerProps] = await Promise.all([getWorkerClient()?.attributes]);

  Flex.MessageInputActions.Content.add(
    <AtalhosSelect
      key="atalhos-button"
      value=""
      setValue={handleAtalhosSelect}
      workerProps={workerProps}
    />,
    {
      if: (props: any) => {
        const pathSplittedBySlash = window.location.pathname.split("/");
        const checkIfIsAgentDesktop = pathSplittedBySlash.find((path) =>
          path.includes("agent-desktop")
        );

        if (checkIfIsAgentDesktop) {
          const task = Flex.TaskHelper.getTaskFromConversationSid(
            props.conversationSid
          );

          if (task) {
            return (
              task?.channelType === "web" || task?.channelType === "whatsapp"
            );
          }

          return false;
        }

        return false;
      },
      sortOrder: 1,
    }
  );

  Flex.MessageInputActions.Content.add(
    <AudioRecorder key="record-audio-component" />,
    {
      if: (props: any) => {
        const pathSplittedBySlash = window.location.pathname.split("/");

        const checkIfIsAgentDesktop = pathSplittedBySlash.find((path) =>
          path.includes("agent-desktop")
        );

        if (checkIfIsAgentDesktop) {
          const task = Flex.TaskHelper.getTaskFromConversationSid(
            props.conversationSid
          );

          if (task) {
            return (
              task?.channelType === "web" || task?.channelType === "whatsapp"
            );
          }

          return false;
        }

        return false;
      },
    }
  );

  Flex.OutboundDialerPanel.Content.remove("queue-select");
  Flex.OutboundDialerPanel.Content.remove("queue-select-caption");

  Flex.OutboundDialerPanel.Content.add(
    <CustomCallers key="change-outbound-caller-id" />,
    { sortOrder: 3 }
  );

  Flex.WorkerSkills.Content.add(
    <WorkerAttributes key="worker-attributes-update" />
  );

  const departmentConfig = await departmentDocument.get();

  Flex.TaskCanvasTabs.Content.add(
    <TaskWrapUpForm key="wrap-up" uniqueName="wrap-up" label="Tabulação" />,
    {
      if: (props: any) => {
        const workerDepartment = getWorkerClient()?.attributes?.department_id;

        if (departmentConfig && departmentConfig.departments) {
          const matchedDepartment = departmentConfig.departments.find(
            (department) => department.id === workerDepartment
          );
          if (matchedDepartment && matchedDepartment.tabs.length) {
            return true;
          }
        }

        return false;
      },
      sortOrder: 7,
    }
  );

  const componentsTaskToRemove: Flex.TaskChannelComponentRemoveRequest[] = [
    { target: "TaskListButtons", key: "accept" },
    { target: "TaskListButtons", key: "reject" },
  ];

  Flex.DefaultTaskChannels.Chat.removedComponents = componentsTaskToRemove;
  Flex.DefaultTaskChannels.Call.removedComponents = componentsTaskToRemove;

  Flex.TaskList.defaultProps.compareFunction = (task1, task2) =>
    task.orderSort(task1 as TaskWithPrivateTask, task2 as TaskWithPrivateTask);

  Flex.TaskListItem.Content.addWrapper((OriginalComponent) => (props) => {
    return (
      <InactivityAgentAlert
        OriginalComponent={OriginalComponent}
        props={props}
        componentScreen="agent"
      />
    );
  });

  Flex.Supervisor.TaskCard.Content.addWrapper(
    (OriginalComponent) => (props) => {
      return (
        <InactivityAgentAlert
          OriginalComponent={OriginalComponent}
          props={props}
          componentScreen="supervisor"
        />
      );
    }
  );
};
