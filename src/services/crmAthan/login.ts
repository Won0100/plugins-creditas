import { AuthType } from 'types/crmAthan/auth';
import { requestAppJson } from '../requestAppJson';

const baseUrl = process.env.FLEX_APP_CRM_BASE_URL;

export const crmAthan = {
    login: async (email: string, password: string) => {
        try {
            return await requestAppJson(
                'POST',
                `${baseUrl}/login`,
                {},
                { email, password }
            ) as AuthType | string | undefined;            
        } catch(err) {
            if(err instanceof Error)
            console.error('crmAthan.login: ', err.message);
        }
    },
    loginMaster: async () => {
        try {
            return await crmAthan.login(
                process.env.FLEX_APP_MASTER_EMAIL as string,
                process.env.FLEX_APP_MASTER_PASSWORD as string
            );
        } catch(err) {
            if(err instanceof Error)
            console.error('crmAthan.loginMaster: ', err.message);
        }
    },
    tokenMaster: async () => {
        try {
            const master = await crmAthan.loginMaster();
            
            if(typeof(master) !== 'string') {
                return master?.master?.auth?.token;
            }
            
            return '';
        } catch(err) {
            if(err instanceof Error)
            console.error('crmAthan.tokenMaster: ', err.message);
        } 
    }
}