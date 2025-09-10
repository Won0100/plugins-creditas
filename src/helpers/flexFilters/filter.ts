import { SkillDefinition } from "@twilio/flex-ui";
import { userInstance } from "../../services/manager/user";
import { teamsDocument } from "services/sync/teams";
import { localStorage } from "helpers/localStorage/actions";
import { LocalStorageItemType } from "../localStorage/LocalStorageItemType";

export const filter = {
  getSkillList: () => {
    const isAdmin = userInstance.userType("admin");
    let defaultSelect = true;
    let filteredTeams: SkillDefinition[] = [];
    const teams = userInstance.getTaskRouterSkills() as SkillDefinition[];
    const workerTeams = userInstance.getWorkerTeams();

    if (isAdmin || !workerTeams) {
      filteredTeams = teams;
      defaultSelect = false;
    } else {
      defaultSelect = true;
      for (const skill of workerTeams) {
        for (const team of teams) {
          if (team.name.startsWith(skill)) {
            filteredTeams.push({
              name: team.name,
              multivalue: team.multivalue,
            });
          }
        }
      }
    }

    return { teams, defaultSelect };
  },
  getActivityList: () => {
    let defaultSelect = true;
    let filteredActivities: SkillDefinition[] = [];
    const activities =
      userInstance.getActivities() as unknown as SkillDefinition[];

    for (const activity of activities) {
      if (activity.name.startsWith(activity.name)) {
        filteredActivities.push({
          name: activity.name,
          multivalue: activity.multivalue,
        });
      }
    }

    return { activities, defaultSelect };
  },
  getTeamList: async () => {
    let defaultSelect = false;
    let filteredTeams: SkillDefinition[] = [];

    await localStorage.setDocument(LocalStorageItemType.TEAMS);
    const localTeams = JSON.parse(localStorage.get(LocalStorageItemType.TEAMS) ?? "[]");
    const teams = localTeams as SkillDefinition[];

    for (const team of teams) {
      if (team.name.startsWith(team.name)) {
        filteredTeams.push({
          name: team.name,
          multivalue: team.multivalue,
        });
      }
    }

    return { teams, defaultSelect };
  },
  getDepartmentList: async () => {
    let defaultSelect = false;
    let filteredDepartments: SkillDefinition[] = [];

    await localStorage.setDocument(LocalStorageItemType.AREAS);
    const localDepartments = JSON.parse(localStorage.get(LocalStorageItemType.AREAS) ?? "[]");
    const departments = localDepartments as SkillDefinition[];

    for (const department of departments) {
      if (department.name.startsWith(department.name)) {
        filteredDepartments.push({
          name: department.name,
          multivalue: department.multivalue,
        });
      }
    }

    return { departments, defaultSelect };
  },
};
