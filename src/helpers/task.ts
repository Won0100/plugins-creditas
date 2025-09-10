import { ITask } from "@twilio/flex-ui";
import { conversation } from "./conversation";
import { date } from "./date";
import { TaskWithPrivateTask } from "../types/task";

export const task = {
  orderSort: (task1: TaskWithPrivateTask, task2: TaskWithPrivateTask) => {
    const lastMessage1 =
      task1.attributes?.lastMessageTimestamp ??
      new Date(task1.dateUpdated).getTime();
    const lastMessage2 =
      task2.attributes?.lastMessageTimestamp ??
      new Date(task2.dateUpdated).getTime();

    return lastMessage1 > lastMessage2 ? -1 : 1;
  },
  convertToDate: (date: Date): Date => {
    return new Date(date);
  },
  calculateAverageWaitingTime: (messages: any[]) => {
    let totalCustomerWaitingTime = 0;
    let waitingCustomerInstances = 0;
    let totalAgentWaitingTime = 0;
    let waitingAgentInstances = 0;
    let lastCustomerMessageTime: Date | null = null;
    let lastAgentMessageTime: Date | null = null;

    for (const message of messages) {
      if (message.source.author?.startsWith("whatsapp:")) {
        lastCustomerMessageTime = task.convertToDate(
          message.source.dateCreated as Date
        );
      } else if (lastCustomerMessageTime) {
        const responseTime =
          task.convertToDate(message.source.dateCreated as Date).getTime() -
          lastCustomerMessageTime.getTime();
        totalCustomerWaitingTime += responseTime / 1000;
        waitingCustomerInstances++;
        lastCustomerMessageTime = null;
      }

      if (!message.source.author?.startsWith("whatsapp:")) {
        lastAgentMessageTime = task.convertToDate(
          message.source.dateCreated as Date
        );
      } else if (lastAgentMessageTime) {
        const responseTime =
          task.convertToDate(message.source.dateCreated as Date).getTime() -
          lastAgentMessageTime.getTime();
        totalAgentWaitingTime += responseTime / 1000;
        waitingAgentInstances++;
        lastAgentMessageTime = null;
      }
    }

    return {
      customer:
        waitingCustomerInstances > 0
          ? totalCustomerWaitingTime / waitingCustomerInstances
          : 0,
      agent:
        waitingAgentInstances > 0
          ? totalAgentWaitingTime / waitingAgentInstances
          : 0,
    };
  },
  getWordsAndCharactersAndDates: (twilioTask: ITask) => {
    const conversationHelper = conversation.getConversationFromTask(twilioTask);

    if (
      conversationHelper?.conversation &&
      twilioTask.channelType !== "voice"
    ) {
      const allMessages = conversationHelper?.conversation.messages;

      const lastBotMessage = allMessages
        .filter((msg: any) => msg?.source?.author?.startsWith("CH"))
        .sort((a: any, b: any) => b.index - a.index)[0];

      const messages = allMessages.filter(
        (msg: any) => msg.index > lastBotMessage?.index
      );

      let characters = 0;
      let words = 0;
      let messagesCustomerCount = 0;
      let messagesAgentCount = 0;
      let dateFirstMessageCustomer = 0;
      let dateFirstMessageAgent = 0;
      let agentFirstMessageTimeInSeconds = 0;
      let customerTotalTimeInSeconds = 0;
      let agentTotalTimeInSeconds = 0;
      let lastCustomerTimestamp: number | null = null;
      let lastAgentTimestamp: number | null = null;

      for (let i = 0; i < messages.length; i++) {
        const body = messages[i].source.body;
        const author = messages[i].source.author;
        const dateCreated = date.getTimestampInSeconds(
          messages[i].source.dateCreated as Date
        );

        if (body) {
          characters += Number(body.length);
          words += Number(body.trim().split(/\s+/).length);
        }

        if (author?.includes("whatsapp:+") || author?.startsWith("FX")) {
          messagesCustomerCount++;

          if (!dateFirstMessageCustomer && dateCreated)
            dateFirstMessageCustomer = dateCreated;
          if (lastAgentTimestamp !== null)
            customerTotalTimeInSeconds += dateCreated - lastAgentTimestamp;

          lastCustomerTimestamp = dateCreated;
        } else {
          messagesAgentCount++;

          if (!dateFirstMessageAgent && dateCreated)
            dateFirstMessageAgent = dateCreated;
          if (lastCustomerTimestamp !== null)
            agentTotalTimeInSeconds += dateCreated - lastCustomerTimestamp;

          lastAgentTimestamp = dateCreated;
        }
      }

      if (dateFirstMessageAgent && dateFirstMessageCustomer) {
        agentFirstMessageTimeInSeconds =
          dateFirstMessageAgent - dateFirstMessageCustomer;
      }

      const waitingTimeMessages = task.calculateAverageWaitingTime(messages);

      return {
        conversation_measure_1: characters,
        conversation_measure_2: words,
        conversation_measure_3: Math.floor(
          Math.abs(agentFirstMessageTimeInSeconds)
        ),
        conversation_measure_4: Math.floor(waitingTimeMessages.agent),
        conversation_measure_5: Math.floor(waitingTimeMessages.customer),
        conversation_measure_6: messagesAgentCount,
        conversation_measure_7: messagesCustomerCount,
      };
    }

    return {};
  },
};
