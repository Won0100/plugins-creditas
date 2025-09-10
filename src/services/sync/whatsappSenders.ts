import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();
const uniqueName = 'whatsapp_sender';
const url = `https://sync.twilio.com/v1/Services/${process.env.FLEX_APP_PLUGINS_SYNC_SERVICE_SID}/Documents`;

/**
 * WhatsApp Senders Sync Document
 * 
 * This service manages WhatsApp sender phone numbers from a Sync document.
 * 
 * Sync Document Setup:
 * - Service Name: flex-plugins
 * - Document Name: whatsapp_sender
 * - Structure:
 *   {
 *     "numbers": [
 *       "+551151962808"
 *     ]
 *   }
 * 
 * The document should contain an array of phone numbers that are authorized
 * to send WhatsApp messages through your Twilio account.
 */

interface WhatsAppSendersType {
  numbers: string[];
}

interface DocumentDataType extends ServiceSyncType {
  data: WhatsAppSendersType;
}

export const whatsappSendersDocument = {
  get: async () => {
    try {
      const response: DocumentDataType = await requestUrlEncoded('get', `${url}/${uniqueName}`);

      if (response) {
        const document = response;

        if (document.data && document.data.numbers) {
          return document;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error('whatsappSendersDocument.get: ', err.message);
      return false;
    }
  },
  update: async (payload: WhatsAppSendersType) => {
    try {
      const getDocument = await whatsappSendersDocument.get();
      let response: boolean | DocumentDataType = false;

      if (getDocument) {
        response = await requestUrlEncoded('post', `${url}/${getDocument.sid}`, {}, { Data: JSON.stringify(payload) });
      } else {
        const create = await whatsappSendersDocument.create();

        if (create && (create?.unique_name === uniqueName)) {
          response = await requestUrlEncoded('post', `${url}/${create.sid}`, {}, { Data: JSON.stringify(payload) });
        }
      }

      return response;
    } catch (err) {
      if (err instanceof Error)
        console.error('whatsappSendersDocument.update: ', err.message);
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
        console.error('whatsappSendersDocument.create: ', err.message);
    }
  }
}; 