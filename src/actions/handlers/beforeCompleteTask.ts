import { Actions, ITask, Notifications } from "@twilio/flex-ui";
import { userInstance } from "services/manager/user";
import { departmentDocument } from "services/sync/department";

export const handleBeforeCompleteTask = () => {
  Actions.addListener(
    "beforeCompleteTask",
    async (payload: { task: ITask }, cancelActionInvocation: () => void) => {
      const departmentConfig = await departmentDocument.get();
      const { getWorkerClient } = userInstance;

      const workerDepartment = getWorkerClient()?.attributes?.department_id;

      let workerHasDepartment = 0;

      if (departmentConfig && departmentConfig.departments) {
        const matchedDepartment = departmentConfig.departments.find(
          (department) => department.id === workerDepartment
        );
        if (matchedDepartment && matchedDepartment.tabs.length) {
          workerHasDepartment = matchedDepartment.tabs.length;
        }
      }

      if (
        payload.task &&
        !payload.task.attributes?.conversations?.initiative &&
        workerHasDepartment
      ) {
        Actions.invokeAction("SetComponentState", {
          name: "AgentTaskCanvasTabs",
          state: { selectedTabName: "wrap-up" },
        });
        Notifications.showNotification("SelectOutcome");
        cancelActionInvocation();
        return;
      }

      if (payload.task?.conference?.participants) {
        const customer = payload.task.conference.participants.find(
          (participant: any) => participant.participantType.includes("customer")
        );

        if (customer && customer.status.includes("left")) {
          await payload.task.setAttributes({
            ...payload.task.attributes,
            conversations: {
              ...payload.task.attributes.conversations,
              hang_up_by: "Cliente",
            },
          });
        }
      }

      try {
        if (payload.task && payload.task.attributes) {
          const conv = {
            ...payload.task.attributes.conversations,
          };

          if (
            payload.task &&
            payload.task.channelType === "voice" &&
            !payload.task.attributes.conversations?.hang_up_by
          ) {
            conv.hang_up_by = "Cliente";
          }

          await payload.task.setAttributes({
            ...payload.task.attributes,
            conversations: conv,
          });
        }
      } catch (err) {
        console.error("beforeCompleteTask", err);
      }
    }
  );
};
