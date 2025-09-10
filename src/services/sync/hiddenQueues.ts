import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();
const uniqueName = `hidden-queues-${manager.serviceConfiguration.account_sid}`;
const url = `https://sync.twilio.com/v1/Services/${manager.serviceConfiguration.attributes?.sync_service_sid || process.env.FLEX_APP_SYNC_SERVICE_SID}/Documents`;

interface DocumentType extends ServiceSyncType {
    data: string[];
}

type DocumentsType = {    
  documents: DocumentType[]
}

export const hiddenQueuesDocument = {
    get: async () => {
        try {
            const response: DocumentsType = await requestUrlEncoded('get', url);

            if(response?.documents?.length > 0) {
                const document = response.documents.filter(document => document.unique_name === uniqueName)[0];

                if(document.data?.length > 0) {
                    return document;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('hiddenQueuesDocument.get: ', err.message);
        }        
    },
    update: async (payload: string[]) => {
        try {
            const getDocument =  await hiddenQueuesDocument.get();  
            let response: boolean | DocumentType = false;         

            if(getDocument) {
                response = await requestUrlEncoded('post', `${url}/${getDocument.sid}`, {}, { Data: JSON.stringify(payload) });
            } else {
                const create = await hiddenQueuesDocument.create();

                if(create && (create?.unique_name === uniqueName)) {
                    response = await requestUrlEncoded('post', `${url}/${create.sid}`, {}, { Data: JSON.stringify(payload) });
                }
            }

            return response;
        } catch(err) {
            if(err instanceof Error)
            console.error('hiddenQueuesDocument.update: ', err.message);
        }
    },
    create: async () => {        
        try {
            const response: DocumentType = await requestUrlEncoded('post', url, {}, { UniqueName: uniqueName });

            if(response?.sid) {
                return response;
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('hiddenQueuesDocument.create: ', err.message);
        }
    }
}