import { activityPanelList } from './activityPanel';
import { whatsappSenderTemplatesDocument } from './whatsappSenderTemplates';
import { whatsappSenderWorkerNumbersDocument } from './whatsappSenderWorkerNumbers';

export const getDocument = {
    activityPanelColor: async () => {
        return await activityPanelList.get();
    },
    whatsappSenderTemplates: async () => {
        return await whatsappSenderTemplatesDocument.get();
    },
    whatsappSenderWorkerNumbers: async () => {
        return await whatsappSenderWorkerNumbersDocument.get();
    }
}