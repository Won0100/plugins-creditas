import { CustomizeTaskInfoType } from '../../types/customizeTaskInfo';
import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();
const uniqueName = `customize-task-info-${manager.serviceConfiguration.account_sid}`;
const url = `https://sync.twilio.com/v1/Services/${manager.serviceConfiguration.attributes?.sync_service_sid || process.env.FLEX_APP_SYNC_SERVICE_SID}/Documents`;
console.debug('url:: ', url)
interface DocumentDataType extends ServiceSyncType {
    data: CustomizeTaskInfoType;
}

type CustomizeTaskInfoDocumentType = {    
  documents: DocumentDataType[]
}

export const customizeTaskInfoDocument = {
    get: async () => {
        try {
            const response: CustomizeTaskInfoDocumentType = await requestUrlEncoded('get', url);

            if(response?.documents?.length > 0) {
                const document = response.documents.filter(document => document.unique_name === uniqueName)[0];

                if(document.data.infoCustomer || document.data.infoTask) {
                    return document;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('customizeTaskInfoDocument.get: ', err.message);
        }        
    },
    update: async (payload: CustomizeTaskInfoType) => {
        try {
            const getDocument =  await customizeTaskInfoDocument.get();  
            let response: boolean | CustomizeTaskInfoType = false;         

            if(getDocument) {
                response = await requestUrlEncoded('post', `${url}/${getDocument.sid}`, {}, { Data: JSON.stringify(payload) });
            } else {
                const create = await customizeTaskInfoDocument.create();

                if(create && (create?.unique_name === uniqueName)) {
                    response = await requestUrlEncoded('post', `${url}/${create.sid}`, {}, { Data: JSON.stringify(payload) });
                }
            }

            return response;
        } catch(err) {
            if(err instanceof Error)
            console.error('customizeTaskInfoDocument.update: ', err.message);
        }
    },
    create: async () => {        
        try {
            const response: DocumentDataType = await requestUrlEncoded('post', url, {}, { UniqueName: uniqueName });

            if(response?.sid) {
                return response;
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('customizeTaskInfoDocument.create: ', err.message);
        }
    }
}