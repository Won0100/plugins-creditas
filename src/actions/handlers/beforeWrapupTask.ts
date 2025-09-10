import { Actions, ITask } from "@twilio/flex-ui";
import { task } from "helpers/task";

export const handleBeforeWrapupTask = () => {
  Actions.addListener(
    "beforeWrapupTask",
    async (payload: { task: ITask }) => {
      // const conversationsMeasures = task.getWordsAndCharactersAndDates(
      //   payload.task
      // );

      //console.log('***', conversationsMeasures)

      try {
        if (payload.task && payload.task.attributes) {
          const conv = {
            ...payload.task.attributes.conversations,
            //...conversationsMeasures,
          };

          await payload.task.setAttributes({
            ...payload.task.attributes,
            conversations: conv,
          });
        }
      } catch (err) {
        console.error("beforeCompleteTask", err);
      }
    }
  );
};
