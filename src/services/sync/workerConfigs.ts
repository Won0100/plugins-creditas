import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';
import { WorkerConfigsSyncType } from '../../types/workerConfigs';

const manager = Manager.getInstance();
const url = `https://sync.twilio.com/v1/Services/${manager.serviceConfiguration.attributes?.sync_service_sid || process.env.FLEX_APP_SYNC_SERVICE_SID}/Documents`;

interface DocumentDataType extends ServiceSyncType {
    data: WorkerConfigsSyncType;
}

export const workerConfigsDocument = {
    get: async (uniqueName: string) => {
        try {
            const response: DocumentDataType = await requestUrlEncoded('get', `${url}/${uniqueName}`);

            if(response) {
                const document = response

                if(document.data) {
                    return document;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('workerConfigsDocument.get: ', err.message);
        }        
    },
    update: async (payload: WorkerConfigsSyncType, uniqueName: string) => {
        try {
            const getDocument =  await workerConfigsDocument.get(uniqueName);  
            let response: boolean | WorkerConfigsSyncType = false;         

            if(getDocument) {
                response = await requestUrlEncoded('post', `${url}/${getDocument.sid}`, {}, { Data: JSON.stringify(payload) });
            } else {
                const create = await workerConfigsDocument.create(uniqueName);

                if(create && (create?.unique_name === uniqueName)) {
                    response = await requestUrlEncoded('post', `${url}/${create.sid}`, {}, { Data: JSON.stringify(payload) });
                }
            }

            return response;
        } catch(err) {
            if(err instanceof Error)
            console.error('workerConfigsDocument.update: ', err.message);
        }
    },
    create: async (uniqueName: string) => {        
        try {
            const response: DocumentDataType = await requestUrlEncoded('post', url, {}, { UniqueName: uniqueName });

            if(response?.sid) {
                return response;
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('workerConfigsDocument.create: ', err.message);
        }
    }
}