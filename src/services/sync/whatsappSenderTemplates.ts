import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();
const uniqueName = 'whatsapp_sender_templates';
const url = `https://sync.twilio.com/v1/Services/${process.env.FLEX_APP_PLUGINS_SYNC_SERVICE_SID}/Documents`;

/**
 * WhatsApp Sender Templates Sync Document
 * 
 * This service manages WhatsApp template IDs that are allowed to be used
 * for sending messages through the WhatsApp Sender component.
 * 
 * Sync Document Setup:
 * - Service Name: flex-plugins
 * - Document Name: whatsapp_sender_templates
 * - Structure:
 *   {
 *     "templates": [
 *       "HX35d69ebf94f714d2e9499956305a94b8",
 *       "HX7ab0812a2de64e0fadc51c35fc63482c"
 *     ]
 *   }
 * 
 * The document should contain an object with a "templates" array of template SIDs
 * that are authorized to be used for sending WhatsApp messages.
 */

interface WhatsAppSenderTemplatesType {
  templates: string[];
}

interface DocumentDataType extends ServiceSyncType {
  data: WhatsAppSenderTemplatesType;
}

export const whatsappSenderTemplatesDocument = {
  get: async () => {
    try {
      const response: DocumentDataType = await requestUrlEncoded('get', `${url}/${uniqueName}`);

      if (response) {
        const document = response;

        if (document.data && document.data.templates && Array.isArray(document.data.templates)) {
          return document;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof Error)
        console.error('whatsappSenderTemplatesDocument.get: ', err.message);
      return false;
    }
  },
  update: async (payload: WhatsAppSenderTemplatesType) => {
    try {
      const getDocument = await whatsappSenderTemplatesDocument.get();
      let response: boolean | DocumentDataType = false;

      if (getDocument) {
        response = await requestUrlEncoded('post', `${url}/${getDocument.sid}`, {}, { Data: JSON.stringify(payload) });
      } else {
        const create = await whatsappSenderTemplatesDocument.create();

        if (create && (create?.unique_name === uniqueName)) {
          response = await requestUrlEncoded('post', `${url}/${create.sid}`, {}, { Data: JSON.stringify(payload) });
        }
      }

      return response;
    } catch (err) {
      if (err instanceof Error)
        console.error('whatsappSenderTemplatesDocument.update: ', err.message);
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
        console.error('whatsappSenderTemplatesDocument.create: ', err.message);
    }
  }
}; 