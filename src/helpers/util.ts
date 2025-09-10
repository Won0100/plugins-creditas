import { ITask, TaskHelper } from "@twilio/flex-ui";
import { userInstance } from "services/manager/user";
import { Reservation } from "twilio-taskrouter/dist/types";

export const util = {
  normalizeFriendlyNames: (name?: string) => {
    if (!name) return "";

    return name.replace(/(_2E)/g, ".").replace("_40", "@");
  },

  getReservationFromUrl: () => {
    const locationSplit = window.location.pathname.split("/");

    const findReservation = locationSplit.find((path) => path.startsWith("WR"));

    return findReservation;
  },

  checkAgentIsOwnerOfTask: (task?: ITask) => {
    if (!task) return false;

    return TaskHelper.isTaskAssignedToCurrentWorker(task);
  },

  getListOfTaskAcceptedByWorker: () => {
    const manager = userInstance.getInstance();

    if (manager.workerClient?.reservations) {
      const reservations: Reservation[] = [
        ...manager.workerClient.reservations.values(),
      ];

      const tasks = reservations.map((reservation) => reservation.task);

      return tasks;
    }

    return [];
  },

  validateEmail: (email: string) => {
    const REGEX_VALIDATE_EMAIL =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    return REGEX_VALIDATE_EMAIL.test(email);
  },
};
