import { userInstance } from "services/manager/user";
import { departmentDocument } from "services/sync/department";

export const setUpActivities = async () => {
  const { userType, getWorkerClient } = userInstance;
  const document = await departmentDocument.get();

  const instanceActivities = userInstance.getActivities();
  const workerClient = userInstance.getWorkerClient();

  if (
    document &&
    (userType("agent") ||
      (userType("supervisor") && !userType("wfo.full_access")))
  ) {
    const department = document.departments.find(
      (doc) => doc.name === workerClient?.attributes.department
    );

    if (department?.activities) {
      for (const activity of instanceActivities) {
        if (!department.activities.find((act) => act === activity.name)) {
          getWorkerClient()?.activities.delete(activity.sid);
        }
      }
    }
  }
};
