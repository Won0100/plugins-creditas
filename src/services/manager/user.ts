import { Manager } from "@twilio/flex-ui";
import { workerConfigsDocument } from "services/sync/workerConfigs";
import { Activity } from "twilio-taskrouter";
import {
  ActivitiesTimesType,
  ActivityTimeType,
  WorkerConfigsSyncType,
} from "types/workerConfigs";
import { AnyAction } from "redux";
import { StatesExtendsType } from "types/manager";
import { TeamsActivitiesDataType } from "types/activities";

const managerInstance = Manager.getInstance();

const handleDocument = async (
  activityName: string,
  activityTime: ActivityTimeType,
  documentConfig: WorkerConfigsSyncType,
  configDay?: string,
  allActivities?: ActivitiesTimesType
): Promise<WorkerConfigsSyncType> => {
  const date = new Date();
  const currentDay = `${date.getDate()}:${
    date.getMonth() + 1
  }:${date.getFullYear()}`;

  if (allActivities) {
    if (currentDay !== configDay) {
      Object.keys(allActivities).forEach((activity) => {
        allActivities[activity].lastTimeUsed = 0;
        allActivities[activity].dailyUsage = 0;
      });
    } else {
      Object.keys(allActivities).forEach((activity) => {
        if (activity !== activityName) {
          allActivities[activity].lastTimeUsed = 0;
        }
      });
    }
  }

  return {
    ...documentConfig,
    configDay: currentDay,
    lastActivityName: activityName,
    activitiesTimes: {
      ...documentConfig.activitiesTimes,
      [activityName]: {
        dailyUsage: activityTime.dailyUsage + 1,
        lastTimeUsed: Date.now(),
      },
    },
  };
};

export const userInstance = {
  getDefaultOfflineActivity: () => "Deslogado",

  userType: (type: "admin" | "supervisor" | "agent" | "wfo.full_access") => {    
    return !!managerInstance.user.roles.find((role) => role === type);
  },
  checkRoleCustom: (type: "admin" | "supervisor" | "agent") => {    
    return managerInstance.workerClient?.attributes?.roleCustom === type;
  },
  workerToken: () => {
    return managerInstance.user.token;
  },
  chatServiceSid: () => {
    return managerInstance.serviceConfiguration.chat_service_instance_sid;
  },
  getTaskRouterSkills: () => {
    return managerInstance.serviceConfiguration.taskrouter_skills;
  },
  getWorkerTeams: () => {
    return managerInstance.workerClient?.attributes.teams;
  },
  getActivities: () => {
    const activities: Map<string, Activity> | undefined =
      managerInstance.workerClient?.activities;
    return Array.from(activities?.values() || []);
  },
  getCurrentActivitie: () => {
    return managerInstance.workerClient?.activity;
  },
  getInstance: () => {
    return managerInstance;
  },
  getQueues: async () => {
    const queues = await managerInstance.workspaceClient?.fetchTaskQueues();
    return Array.from(queues?.values() || []);
  },
  dispatch: (action: AnyAction) => {
    managerInstance.store.dispatch(action);
  },
  getState: () => {
    return managerInstance.store.getState() as StatesExtendsType;
  },
  getWorkerClient: () => {
    return managerInstance.workerClient;
  },

  _workerSid: undefined as string | undefined,
  getWorkerSid: () => {
    if (managerInstance.workerClient?.sid && userInstance._workerSid !== managerInstance.workerClient?.sid)
      userInstance._workerSid = managerInstance.workerClient?.sid

    return userInstance._workerSid;
  },
  getWorkerSyncDocumentUniqueName: () => {
    return `syncDoc.${userInstance.getWorkerSid()}`;
  },
  getAccount: () => {
    const accountAttributes = managerInstance.serviceConfiguration.attributes;
    const account = {
      accountSid: managerInstance.serviceConfiguration.account_sid,
      authToken:
        accountAttributes.auth_token || process.env.FLEX_APP_AUTH_TOKEN,
      workspaceSid: managerInstance.workspaceClient?.workspaceSid,
      apiBaseUrl:
        accountAttributes.api_base_url || process.env.FLEX_APP_API_BASE_URL,
      syncServiceSid:
        accountAttributes.sync_service_sid ||
        process.env.FLEX_APP_SYNC_SERVICE_SID,
    };
    return account;
  },
  updateActivityConfig: async (
    activityName: string,
    uniqueName: string,
    actionType: "supervisor" | "agent" | "system"
  ) => {
    const defaultDailyUsage = {
      dailyUsage: 0,
      lastTimeUsed: Date.now(),
    };    

    const workerActivityUsageDocument = await workerConfigsDocument.get(uniqueName);

    if(workerActivityUsageDocument) {
      const { lastActivityName = userInstance.getDefaultOfflineActivity() } = workerActivityUsageDocument.data;

      if (lastActivityName === activityName) {
        return {
          status: "finishAction",
          message: "Mesma atividade selecionada",
        };
      }
      
      const getState = userInstance.getState();
      const workerAttributeTeam = managerInstance.workerClient?.attributes?.team ?? 'Padrão';
      const activeTeamsSync = getState['activity-teams'].activityTeams;
      let activeTeam = {} as TeamsActivitiesDataType;

      if(activeTeamsSync?.length > 0) {
        for(let i = 0; i < activeTeamsSync.length; i++) {          
          if(activeTeamsSync[i].data[workerAttributeTeam]) {
            activeTeam = activeTeamsSync[i];
            break;
          }
        }
      }      

      const activitiesTimesConfig =
        workerActivityUsageDocument.data.activitiesTimes;

      const lastActivityConfig = activeTeam?.data?.[workerAttributeTeam]?.[lastActivityName];
      const actualActivityConfig =
        activeTeam?.data?.[workerAttributeTeam]?.[activityName];

      const actualActivity =
        activitiesTimesConfig?.[activityName] || defaultDailyUsage;
      const lastActivity =
        activitiesTimesConfig?.[lastActivityName] || defaultDailyUsage;

      const lastTimeUsedInSeconds =
        lastActivity.lastTimeUsed === 0
          ? 0
          : Date.now() - lastActivity.lastTimeUsed;

      if (actionType === "agent") {
        if (
          actualActivityConfig?.dailyUsageLimit &&
          actualActivityConfig?.dailyUsageLimit <= actualActivity?.dailyUsage
        ) {
          return {
            status: "cancelAction",
            message:
              "Atividade já usada durante o dia, fale com seu supervisor para alterar a sua atividade",
          };
        } else if (
          lastActivity.lastTimeUsed !== 0 &&
          lastActivityConfig?.minTime &&
          lastTimeUsedInSeconds < lastActivityConfig.minTime
        ) {
          return {
            status: "cancelAction",
            message:
              "Limite de tempo mínimo para atividade ainda não atingido, fale com seu supervisor para alterar a sua atividade",
          };
        } else if (
          lastActivity.lastTimeUsed !== 0 &&
          lastActivityConfig?.maxTime &&
          lastTimeUsedInSeconds > lastActivityConfig.maxTime
        ) {
          return {
            status: "cancelAction",
            message:
              "Limite de tempo máximo para atividade já atingido, fale com seu supervisor para alterar a sua atividade",
          };
        }
      }

      const newState = await handleDocument(
        activityName,
        actualActivity,
        workerActivityUsageDocument.data,
        workerActivityUsageDocument.data.configDay,
        activitiesTimesConfig
      );

      workerConfigsDocument.update(newState, uniqueName);
    }

    return {
      status: "finishAction",
      message: "Atividade alterada com sucesso",
    };
  },
  initiateActivityConfig: async (
    activityName: string,
    uniqueName: string,
  ) => {
    const today = new Date();
    const configDay = `${today.getDate()}:${today.getMonth() + 1}:${today.getFullYear()}`;

    const workerActivityUsageDocument = await workerConfigsDocument.get(uniqueName);
    if(workerActivityUsageDocument && workerActivityUsageDocument.data.configDay === configDay)
      return;

    let configToUpdate: WorkerConfigsSyncType | null = null;
    if (!workerActivityUsageDocument) {
      configToUpdate = await handleDocument(
        activityName,
        { dailyUsage: 0, lastTimeUsed: Date.now() },
        { 
          configDay, 
          lastActivityName: activityName, 
          data: { supervisors: [] }
        },
      );
    }
    else {
      configToUpdate = await handleDocument(
        activityName,
        { dailyUsage: 0, lastTimeUsed: Date.now() },
        workerActivityUsageDocument.data,
        workerActivityUsageDocument.data.configDay,
        workerActivityUsageDocument.data.activitiesTimes
      );
    }

    await workerConfigsDocument.update(
      configToUpdate,
      uniqueName
    )
  },
};
