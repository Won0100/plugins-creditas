import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();
const uniqueName = 'whatsapp_sender_worker_numbers';
const syncServiceSid = process.env.FLEX_APP_PLUGINS_SYNC_SERVICE_SID;
const url = `https://sync.twilio.com/v1/Services/${syncServiceSid}/Documents`;

console.log('whatsappSenderWorkerNumbers config:', {
  uniqueName,
  syncServiceSid,
  url
});

/**
 * WhatsApp Sender Worker Numbers Sync Document
 * 
 * This service manages WhatsApp sender phone numbers for specific workers from a Sync document.
 * 
 * Sync Document Setup:
 * - Service Name: flex-plugins
 * - Document Name: whatsapp_sender_worker_numbers
 * - Structure:
 *   {
 *     "athan.eduarte@creditas.com": ["+55911111111", "+55922222222"],
 *     "other.worker@creditas.com": ["+55933333333"]
 *   }
 * 
 * The document should contain a mapping of worker emails to their authorized
 * phone numbers for sending WhatsApp messages.
 */

interface WhatsAppSenderWorkerNumbersType {
  [workerEmail: string]: string[];
}

interface DocumentDataType extends ServiceSyncType {
  data: WhatsAppSenderWorkerNumbersType;
}

export const whatsappSenderWorkerNumbersDocument = {
  get: async () => {
    try {
      
      const response: DocumentDataType = await requestUrlEncoded('get', `${url}/${uniqueName}`);

      if (response) {
        const document = response;

        if (document.data) {
          return document;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error('whatsappSenderWorkerNumbersDocument.get: ', err.message);
      return false;
    }
  },
  update: async (payload: WhatsAppSenderWorkerNumbersType) => {
    try {
      const getDocument = await whatsappSenderWorkerNumbersDocument.get();
      let response: boolean | DocumentDataType = false;

      if (getDocument) {
        response = await requestUrlEncoded('post', `${url}/${getDocument.sid}`, {}, { Data: JSON.stringify(payload) });
      } else {
        const create = await whatsappSenderWorkerNumbersDocument.create();

        if (create && (create?.unique_name === uniqueName)) {
          response = await requestUrlEncoded('post', `${url}/${create.sid}`, {}, { Data: JSON.stringify(payload) });
        }
      }

      return response;
    } catch (err) {
      if (err instanceof Error)
        console.error('whatsappSenderWorkerNumbersDocument.update: ', err.message);
    }
  },
  create: async () => {
    try {
      const response: DocumentDataType = await requestUrlEncoded('post', url, {}, { UniqueName: uniqueName });

      if (response?.sid) {
        return response;
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error('whatsappSenderWorkerNumbersDocument.create: ', err.message);
    }
  }
}; 