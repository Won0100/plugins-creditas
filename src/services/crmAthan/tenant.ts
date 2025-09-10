import { requestAppJson } from '../requestAppJson';
import { TenantType } from '../../types/crmAthan/tenants';
import { crmAthan } from './login';

const baseUrl = process.env.FLEX_APP_CRM_BASE_URL;

export const tenantCrm = {
    list: async () => {
        try {
            return await requestAppJson(
                'GET',
                `${baseUrl}/tenant/list`,
            ) as TenantType[];            
        } catch(err) {
            if(err instanceof Error)
            console.error('tenantCrm.list: ', err.message);
        }
    },
    getItem: async (id: string) => {
        try {
            const tokenMaster = await crmAthan.tokenMaster() || '';
            
            return await fetch(`${baseUrl}/tenant/read/id/${id}`, {
                method: 'GET',
                headers: { 'Authorization': tokenMaster },
            }).then(response => response.json()) as TenantType;
        } catch(err) {
            if(err instanceof Error)
            console.error('tenantCrm.getItem: ', err.message); 
        }
    }
}