import { ServiceConfiguration } from '@twilio/flex-ui';
import { RecordGlobal } from '../types/record';
import { requestUrlEncoded } from './requestUrlEncoded';
import { requestAppJson } from './requestAppJson';

export const serviceConfiguration = {
    get: async () => {
        try {
            return await requestAppJson(
                'get',
                'https://flex-api.twilio.com/v1/Configuration',
                {},
                {},
                true
            ) as ServiceConfiguration;
        } catch (err) {
            if (err instanceof Error)
            console.error("serviceConfiguration.get: ", err.message);
        }
    },
    update: async (payload: RecordGlobal) => {
        try {
            const serviceAttributes = await serviceConfiguration.get();

            const updateAttributes = {
                account_sid: serviceAttributes?.account_sid,
                attributes: {
                    ...serviceAttributes?.attributes,
                    ...payload
                }
            } as ServiceConfiguration;
            
            return await requestAppJson(
                'post',
                'https://flex-api.twilio.com/v1/Configuration',
                {},
                updateAttributes,
                true
            ) as ServiceConfiguration;
        } catch (err) {
            if (err instanceof Error)
            console.error("serviceConfiguration.get: ", err.message);
        }
    }
}