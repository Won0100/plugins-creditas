import { ITask, ConversationHelper, StateHelper } from "@twilio/flex-ui";
import { ConversationFromTask } from "types/conversation";

export const conversation = {
    getConversationFromTask: (task: ITask) => {
        const conversationState = StateHelper.getConversationStateForTask(task);
        
        if(conversationState) {
            const conversationHelper = new ConversationHelper(conversationState);
            return conversationHelper as unknown as ConversationFromTask
        }
    }
}