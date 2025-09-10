import { Actions } from '@twilio/flex-ui'

export const handleBeforeHangupCall = () => {
    Actions.addListener("beforeHangupCall", async ({ task }) => {
        try {
            if (task.conference.liveParticipantCount <= 2) {
                await task.setAttributes({
                    ...task.attributes,
                    conversations: {
                        ...task.attributes.conversations,
                        hang_up_by: "Agente",
                    },
                });
            }
        } catch (err) {
            console.error("beforeHangupCall", err);
        }
    });
}