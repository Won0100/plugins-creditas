import { AudioPlayerManager, TaskHelper } from "@twilio/flex-ui";
import { invokeAction } from "actions/invoke";
import { localStorage, copilotStorage } from "helpers/localStorage/actions";
import { util } from "helpers/util";
import { activitiesFlagColorDocument } from "services/sync/activitiesFlagColor";
import { activityPanelList } from "services/sync/activityPanel";
import { validQueuesDocument } from "services/sync/validQueuesDocument";
import ptBr from "../../assets/languages/pt-BR.json";
import { userInstance } from "../../services/manager/user";
import { clearSyncDoc, closeSyncDoc } from "../../services/supervisorBargeCoach";
import { Actions as BargeCoachStatusAction } from "../../states/supervisorBargeCoach/BargeCoachState";
import { sendLogs } from "services/datadog";
import { LocalStorageItemType } from "helpers/localStorage/LocalStorageItemType";
import { conversation } from "helpers/conversation";
import { copilotService } from "../../services/copilotService";
import { backgroundMessageHandler } from "../../helpers/backgroundMessageHandler";
const workerClient = userInstance.getWorkerClient();


export const addListener = {
  pluginsLoaded: () => {
    userInstance.getInstance().events.addListener("pluginsLoaded", async () => {
      await sendLogs(
        `Usuário ${workerClient?.attributes.email} realizou o login no Twilio Flex com a atividade - ${workerClient?.activity.name}`
      );
      const manager = userInstance.getInstance();
      manager.strings = { ...manager.strings, ...ptBr };

      await Promise.all([
        localStorage.setDocument(LocalStorageItemType.TEAMS),
        localStorage.setDocument(LocalStorageItemType.AREAS),
      ]);

      const [activityPanel, flagColor] = await Promise.all([
        activityPanelList.get(),
        activitiesFlagColorDocument.get(),
      ]);

      userInstance.dispatch({
        type: "SET_DATA_TEAMS_ACTIVITIES",
        payload: activityPanel,
      });

      if (flagColor) {
        userInstance.dispatch({
          type: "SET_DATA_ACTIVITIES_FLAG_COLOR",
          payload: flagColor.data,
        });
      }

      userInstance.dispatch({
        type: "UPDATE_LAST_ACTIVITY",
        payload:
          userInstance.getCurrentActivitie()?.name ??
          userInstance.getDefaultOfflineActivity(),
      });

      await userInstance.initiateActivityConfig(
        userInstance.getCurrentActivitie()?.name ??
          userInstance.getDefaultOfflineActivity(),
        userInstance.getWorkerSyncDocumentUniqueName()
      );
    });
  },
  reservationCreated: () => {
    const manager = userInstance.getInstance();

    if (!manager?.workerClient) {
      return;
    }

    manager.workerClient.on("reservationCreated", async function (reservation) {
      const reservationData = {
        reservationSid: reservation.sid,
        conversationSid: reservation.task.attributes?.conversationSid,
        taskSid: reservation.task.sid,
        customerAddress: reservation.task.attributes?.customerAddress,
      };

      // Check if the reservation is in a valid queue for copilot
      let shouldCreateConversation = true;
      try {
        const taskQueue = reservation.task.queueName;
        if (taskQueue) {
          const validQueuesConfig = await validQueuesDocument.get();
          const validQueues = validQueuesConfig?.queues || [];
          //const validQueues = ['[WhatsApp] Seguros Novos'];

          if (manager.serviceConfiguration.account_sid === process.env.REACT_APP_TWILIO_ACCOUNT_SID) {
            shouldCreateConversation = true;
          }else{
            // Only create conversation if queue is in valid queues list or if no valid queues are configured
            shouldCreateConversation = validQueues.length === 0 || validQueues.includes(taskQueue);
          }
          
          

        }
      } catch (error) {
        console.error('Error checking valid queues for copilot:', error);
        // If there's an error checking queues, don't create conversation to be safe
        shouldCreateConversation = false;
      }

      // Create initial conversation state in localStorage only if queue is valid
      if (reservationData.conversationSid && reservationData.reservationSid && shouldCreateConversation) {
        console.log(`[CopilotIA] Creating initial conversation for reservation ${reservationData.reservationSid}`);
        
        const conversationState = {
          messages: [],
          pendingMessages: [],
          isProcessing: false,
          conversationSid: reservationData.conversationSid,
          lastUpdated: Date.now()
        };

        try {
          // Get existing conversations and add new one
          const conversations = copilotStorage.getConversations();
          console.log(`[CopilotIA] Current conversations count: ${Object.keys(conversations).length}`);
          
          conversations[reservationData.reservationSid] = conversationState;
          copilotStorage.setConversations(conversations);
          console.log(`[CopilotIA] Stored initial conversation for ${reservationData.reservationSid}`);

          // Update conversation mapping only if it doesn't exist
          const mapping = copilotStorage.getMapping();
          if (!mapping[reservationData.reservationSid]) {
            mapping[reservationData.reservationSid] = reservationData.conversationSid;
            copilotStorage.setMapping(mapping);
            console.log(`[CopilotIA] Updated mapping for ${reservationData.reservationSid}`);
          } else {
            console.log(`[CopilotIA] Mapping already exists for ${reservationData.reservationSid}`);
          }
        } catch (error) {
          console.error(`[CopilotIA] Error creating initial conversation for ${reservationData.reservationSid}:`, error);
        }
      } else {
        console.log(`[CopilotIA] Skipping conversation creation - missing data or invalid queue`);
      }

      await sendLogs(
        `Iniciou plugin auto accept - Usuário ${workerClient?.attributes.email}`,
        reservationData
      );

      await sendLogs(
        `Iniciou plugin auto accept - Usuário ${workerClient?.attributes.email} - Telefone: ${reservation.task.attributes?.customerAddress} - conversationSid: ${reservation.task.attributes?.conversationSid} - taskSid: ${reservation.task.sid}`, 
        reservationData
      );
      
      const tasksAccepted = util.getListOfTaskAcceptedByWorker();

      const checkSomeVoiceTaskIsAccepted = tasksAccepted.find(
        (task) => task.taskChannelUniqueName === "voice"
      );

      if (
        reservation.task.attributes?.direction === "inbound" &&
        !(
          reservation.status === "canceled" ||
          reservation.task.status === "canceled"
        ) &&
        !checkSomeVoiceTaskIsAccepted
      ) {
        AudioPlayerManager.play({
          url: "https://indigo-hamster-6429.twil.io/assets/new-reservation-sound.mp3",
          repeatable: false,
        });
      }

      reservation.on("wrapup", async () => {
        if (reservation.task.taskChannelUniqueName !== "voice") return;

        try {
          manager.store.dispatch(
            BargeCoachStatusAction.resetBargeCoachStatus()
          );

          const workerSid = manager.store.getState().flex?.worker?.worker?.sid;
          const agentSyncDoc = `syncDoc.${workerSid}`;

          await clearSyncDoc(agentSyncDoc);
          await closeSyncDoc(agentSyncDoc);
        } catch (ex: any) {
          //console.error("## reservationCreated error clearSyncDoc/closeSyncDoc", ex);
        }
      });

      // Add cleanup listener for when reservation is completed
      reservation.on("completed", async () => {
        const reservationSid = reservation.sid;
        console.log(`[CopilotIA] Reservation completed: ${reservationSid}`);
        
        try {
          // Remove conversation from copilot storage
          const conversations = copilotStorage.getConversations();
          if (conversations[reservationSid]) {
            delete conversations[reservationSid];
            copilotStorage.setConversations(conversations);
            console.log(`[CopilotIA] Removed conversation from localStorage for ${reservationSid}`);
          }

          // Remove from mapping
          const mapping = copilotStorage.getMapping();
          if (mapping[reservationSid]) {
            delete mapping[reservationSid];
            copilotStorage.setMapping(mapping);
            console.log(`[CopilotIA] Removed mapping for ${reservationSid}`);
          }
        } catch (error) {
          console.error(`[CopilotIA] Error cleaning up conversation for ${reservationSid}:`, error);
        }
      });

      if (
        reservation.task &&
        !(reservation.task.taskChannelUniqueName === "voice") &&
        !reservation.task.attributes.conversations?.hang_up_by
      ) {
        await reservation.task.setAttributes({
          ...reservation.task.attributes,
          conversations: {
            ...reservation.task.attributes.conversations,
            hang_up_by: "Agente",
          },
        });
      }

      const task = TaskHelper.getTaskByTaskSid(reservation.sid);
      if (
        !TaskHelper.isInitialOutboundAttemptTask(task) &&
        reservation.status == "pending"
      )
        await invokeAction.acceptTask(reservation);
    });
  },
  workerActivityUpdated: () => {
    userInstance
      .getInstance()
      .events.addListener("workerActivityUpdated", async (activity) => {
        if (
          activity.name ===
          userInstance.getState()["activities-times"].activitiesTimes
            .lastActivity
        )
          return;

        await userInstance.updateActivityConfig(
          activity.name,
          userInstance.getWorkerSyncDocumentUniqueName(),
          "system"
        );

        userInstance.dispatch({
          type: "UPDATE_LAST_ACTIVITY",
          payload: activity.name,
        });
      });
  },
  messageAdded: () => {
    const manager = userInstance.getInstance();

    manager.conversationsClient.on("messageAdded", async (payload) => {
      const task = TaskHelper.getTaskFromConversationSid(
        payload.conversation.sid
      );

      const tasksAccepted = util.getListOfTaskAcceptedByWorker();
      if (tasksAccepted.length === 0) {// caso uma conversation não tenha task, apaga/closed a conversation
        const conversation = await manager.conversationsClient.getConversationBySid( payload.conversation.sid )
        await conversation.delete();
        return;
      }

      // Fallback: Check if conversation exists in copilot storage, if not create it
      try {
        const conversationSid = payload.conversation.sid;
        console.log(`[CopilotIA] Starting fallback check for conversation ${conversationSid}`);
        
        const mapping = copilotStorage.getMapping();
        console.log(`[CopilotIA] Current mapping:`, mapping);
        
        const reservationSid = Object.keys(mapping).find(key => mapping[key] === conversationSid);
        console.log(`[CopilotIA] Found reservation SID in mapping: ${reservationSid}`);
        
        // If no mapping exists, try to find the task for this conversation
        if (!reservationSid && task) {
          const taskSid = task.sid;
          console.log(`[CopilotIA] No mapping found, processing task ${taskSid}`);
          
          // Check if worker has required skills
          const workerAttributes = manager.workerClient?.attributes;
          const workerSkills = workerAttributes?.routing?.skills || [];
          const requiredSkills = ['copilot_enabled'];
          const hasSkill = requiredSkills.some(skill => workerSkills.includes(skill));
          
          console.log(`[CopilotIA] Worker skills:`, workerSkills);
          console.log(`[CopilotIA] Has required copilot skill: ${hasSkill}`);
          
          if (hasSkill) {
            // Check if task queue is in valid queues
            const taskQueue = task.queueName;
            console.log(`[CopilotIA] Task queue: ${taskQueue}`);
            
            if (taskQueue) {
              try {
                const validQueuesConfig = await validQueuesDocument.get();
                const validQueues = validQueuesConfig?.queues || [];
                console.log(`[CopilotIA] Valid queues config:`, validQueues);
                
                let shouldCreateConversation = false;
                
                if (manager.serviceConfiguration.account_sid === process.env.REACT_APP_TWILIO_ACCOUNT_SID) {
                  shouldCreateConversation = true;
                  console.log(`[CopilotIA] Special account detected, creating conversation`);
                } else {
                  // Only create conversation if queue is in valid queues list or if no valid queues are configured
                  shouldCreateConversation = validQueues.length === 0 || validQueues.includes(taskQueue);
                  console.log(`[CopilotIA] Should create conversation: ${shouldCreateConversation} (validQueues.length: ${validQueues.length}, includes queue: ${validQueues.includes(taskQueue)})`);
                }
                
                if (shouldCreateConversation) {
                  console.log(`[CopilotIA] Creating conversation in storage...`);
                  
                  // Create the conversation in copilot storage
                  const conversationState = {
                    messages: [],
                    pendingMessages: [],
                    isProcessing: false,
                    conversationSid: conversationSid,
                    lastUpdated: Date.now()
                  };

                  try {
                    // Get existing conversations and add new one
                    const conversations = copilotStorage.getConversations();
                    console.log(`[CopilotIA] Current conversations count: ${Object.keys(conversations).length}`);
                    
                    conversations[taskSid] = conversationState;
                    copilotStorage.setConversations(conversations);
                    console.log(`[CopilotIA] Successfully stored conversation for task ${taskSid}`);

                    // Update conversation mapping
                    mapping[taskSid] = conversationSid;
                    copilotStorage.setMapping(mapping);
                    console.log(`[CopilotIA] Successfully updated mapping for task ${taskSid}`);
                    
                    console.log(`[CopilotIA] Fallback: Created conversation in storage for task ${taskSid} and conversation ${conversationSid}`);
                    await sendLogs(
                      `Fallback: Created copilot conversation for task ${taskSid} - Usuário ${workerClient?.attributes.email}`,
                      { taskSid, conversationSid, taskQueue }
                    );
                  } catch (storageError) {
                    console.error(`[CopilotIA] Error storing conversation in copilot storage:`, storageError);
                    throw storageError;
                  }
                } else {
                  console.log(`[CopilotIA] Skipping conversation creation - conditions not met`);
                }
              } catch (validQueuesError) {
                console.error(`[CopilotIA] Error fetching valid queues config:`, validQueuesError);
                throw validQueuesError;
              }
            } else {
              console.log(`[CopilotIA] No task queue found, skipping conversation creation`);
            }
          } else {
            console.log(`[CopilotIA] Worker does not have required copilot skills, skipping`);
          }
        } else if (reservationSid) {
          console.log(`[CopilotIA] Conversation already exists in mapping, no action needed`);
        } else {
          console.log(`[CopilotIA] No task found for conversation, skipping fallback creation`);
        }
      } catch (error) {
        console.error('[CopilotIA] Error in fallback conversation creation:', error);
        // Don't block the message processing if fallback fails
      }

      const checkSomeVoiceTaskIsAccepted = tasksAccepted.find(
        (task) => task.taskChannelUniqueName === "voice"
      );

      if (
        util.normalizeFriendlyNames(payload.author!) !==
          util.normalizeFriendlyNames(manager.workerClient?.name!) &&
        util.checkAgentIsOwnerOfTask(task!) &&
        !checkSomeVoiceTaskIsAccepted
      ) {
        AudioPlayerManager.play({
          url: "https://indigo-hamster-6429.twil.io/assets/new-message-sound.mp3",
          repeatable: false,
        });
      }
      
      // Enviar mensagem para o componente CopilotIA
      userInstance.dispatch({
        type: "SET_COPILOT_IA_MESSAGE",
        payload: {
          message: payload.body,
          author: payload.author,
          conversation: payload.conversation,
          task: task,
          sid: payload.sid
        }
      });
    });
  },
  userLoggedIn: () => {
    userInstance.getInstance().events.addListener("userLoggedIn", async () => {
      console.log("userLoggedIn");
      const manager = userInstance.getInstance();
      const workerClient = manager.workerClient;

      if (!workerClient) {
        await sendLogs('Worker client não encontrado durante login');
        return;
      }

      const availableActivity = Array.from(workerClient.activities.values()).find(
        (activity: any) => activity.name === "Disponível"
      );

      if (!availableActivity) {
        await sendLogs('Atividade "Disponível" não encontrada');
        return;
      }

      const currentActivity = workerClient.activity;

      if (currentActivity?.name === "Deslogado" && !currentActivity.available) {
        try {
          await invokeAction.setWorkerActivity(workerClient.workerSid, availableActivity.sid);
          await sendLogs(
            `Atividade do agente alterada para Disponível - Usuário ${workerClient.attributes.email}`
          );
        } catch (error) {
          await sendLogs(
            `Erro ao alterar atividade do agente para Disponível - ${error}`,
            { error }
          );
        }
      }
    });
  }
};
