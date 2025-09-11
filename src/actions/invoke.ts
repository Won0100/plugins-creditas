import { Actions, ITask, TaskHelper } from "@twilio/flex-ui";
import { localStorage } from "../helpers/localStorage/actions";
import { sendLogs } from "services/datadog";
import { userInstance } from "services/manager/user";
import { Reservation } from "twilio-taskrouter/dist/types";
import { LocalStorageItemType } from "../helpers/localStorage/LocalStorageItemType";

const workerClient = userInstance.getWorkerClient();
console.log('teste pipeline')
export const invokeAction = {
    navigateToView: async (viewName: string) => {
        await Actions.invokeAction('NavigateToView', { viewName })
            .then(() => {
                if(viewName.startsWith('dialer')) {
                    localStorage.set(LocalStorageItemType.ATHAN_DIALER_LOCATION, viewName);
                }
            })
            .catch(err => console.error('NavigateToView', err.message));
    },
    acceptTask: async (reservation: Reservation) => {
        await Actions.invokeAction('AcceptTask', { sid: reservation.sid });
        await sendLogs(
            `Task ${reservation.sid} aceita automaticamente - Usuário ${workerClient?.attributes.email} - Telefone: ${reservation.task.attributes?.customerAddress} - conversationSid: ${reservation.task.attributes?.conversationSid} - taskSid: ${reservation.task.sid}`,
            {
                reservationSid: reservation.sid,
                conversationSid: reservation.task.attributes?.conversationSid,
                taskSid: reservation.task.sid,
                customerAddress: reservation.task.attributes?.customerAddress
            }            
        );
    },
    completeTask: async (reservationSid: string) => {
        await Actions.invokeAction('CompleteTask', { sid: reservationSid });
    },
    setWorkerActivity: async (workerSid: string, activitySid: string) => {
        await Actions.invokeAction('SetWorkerActivity', { workerSid, activitySid });
    },
    setInputText: async (text: string, conversationSid: string) => {
        await Actions.invokeAction('SetInputText', { body: text, conversationSid: conversationSid });
    }
}
