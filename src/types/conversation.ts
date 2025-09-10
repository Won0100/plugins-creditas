
import { ConversationState } from '@twilio/flex-ui/src/flex-ui-core/src/index';
import { ParticipantState } from '@twilio/flex-ui/src/state/Participants/participants.types';
import { MessageState } from '@twilio/flex-ui/src/flex-ui-core/src/state/ConversationState'


export type ConversationFromTask = {
    conversation?: ConversationState.ConversationState;
    lastMessage: MessageState;
    typers: ParticipantState[];
    conversationType: any;
    isCustomerOnline: boolean;
}