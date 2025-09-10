import { Actions } from "@twilio/flex-ui";
import { userInstance } from "services/manager/user";

export const handleBeforeSetWorkerActivity = () => {
  Actions.addListener("afterSetWorkerActivity", async (payload) => {
    const uniqueName = `syncDoc.${payload.workerSid}`;
    await userInstance.updateActivityConfig(
      payload.activityName, 
      uniqueName, 
      "supervisor"
    );
  });
};
