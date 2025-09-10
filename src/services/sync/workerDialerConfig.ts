import { requestUrlEncoded } from '../requestUrlEncoded';
import { ServiceSyncType } from '../../types/sync';
import { Manager } from '@twilio/flex-ui';
import { WorkerDialerConfigSyncType } from '../../types/workerDialerConfig';

const manager = Manager.getInstance();
const url = `https://sync.twilio.com/v1/Services/${manager.serviceConfiguration.attributes?.sync_service_sid || process.env.FLEX_APP_SYNC_SERVICE_SID}/Documents`;

interface DocumentDataType extends ServiceSyncType {
    data: WorkerDialerConfigSyncType;
}

/**
 * Exemplo de document: worker-dialer-config
 * 
{
  "data": [
    {
      "callerId": "1130903111",
      "destNumbers": [
        "34984471771"
      ],
      "ipAddress": "177.20.193.22",
      "techPrefix": "110860",
      "workerSid": "WK39b333c0573d7282563f16f9a26e5a5c"
    }
  ]
}
 */

export const workerDialerConfigDocument = {
    getAll: async (uniqueName: string) => {
        try {
            const response: DocumentDataType = await requestUrlEncoded('get', `${url}/${uniqueName}`);

            if(response) {
                const document = response

                if(document.data) {
                    return document.data;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch(err) {
            if(err instanceof Error)
                console.error('workerDialerConfigDocument.get: ', err.message);
        }        
    },
    getWorkerIdAndDestNumbers: async (uniqueName: string, workerSid: string, destNumber: string) => {
        const document = await workerDialerConfigDocument.getAll(uniqueName);
        if (document && document.data) {
            // Primeiro, procura especificamente pelo workerSid fornecido
            const foundItem = document.data.find(item => 
                item.workerSid === workerSid && 
                item.destNumbers.some(number => destNumber.includes(number))
            );
        
            return foundItem || false;
        }
        return false;
    },
}
