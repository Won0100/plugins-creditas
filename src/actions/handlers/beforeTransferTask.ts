import { Actions } from "@twilio/flex-ui";

export const handleBeforeTransferTask = () => {
  Actions.addListener("beforeTransferTask", () => {
    if (window.location.pathname.includes("teams")) {
      Actions.invokeAction("SelectTaskInSupervisor", {
        sid: undefined,
      });
    }
  });
};
