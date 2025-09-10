import { CustomThemeType } from '../../types/theme';
import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();
const uniqueName = `custom-theme-${manager.serviceConfiguration.account_sid}`;
const url = `https://sync.twilio.com/v1/Services/${manager.serviceConfiguration.attributes?.sync_service_sid || process.env.FLEX_APP_SYNC_SERVICE_SID}/Documents`;

interface DocumentThemeType extends ServiceSyncType {
    data: CustomThemeType;
}

type DocumentsThemeType = {    
  documents: DocumentThemeType[]
}

export const themeDocument = {
    get: async () => {
        try {
            const response: DocumentsThemeType = await requestUrlEncoded('get', url);

            if(response?.documents?.length > 0) {
                const document = response.documents.filter(document => document.unique_name === uniqueName)[0];

                if(document.data?.dark) {
                    return document;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('themeDocument.get: ', err.message);
        }        
    },
    update: async (payload: CustomThemeType) => {
        try {
            const getDocument =  await themeDocument.get();  
            let response: boolean | DocumentThemeType = false;         

            if(getDocument) {
                response = await requestUrlEncoded('post', `${url}/${getDocument.sid}`, {}, { Data: JSON.stringify(payload) });
            } else {
                const create = await themeDocument.create();

                if(create && (create?.unique_name === uniqueName)) {
                    response = await requestUrlEncoded('post', `${url}/${create.sid}`, {}, { Data: JSON.stringify(payload) });
                }
            }

            return response;
        } catch(err) {
            if(err instanceof Error)
            console.error('themeDocument.update: ', err.message);
        }
    },
    create: async () => {        
        try {
            const response: DocumentThemeType = await requestUrlEncoded('post', url, {}, { UniqueName: uniqueName });

            if(response?.sid) {
                return response;
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
            console.error('themeDocument.create: ', err.message);
        }
    }
}