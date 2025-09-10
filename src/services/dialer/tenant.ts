import { crmAthan } from '../crmAthan/login';

const baseUrl = process.env.FLEX_APP_DIALER_BASE_URL;

// type DataTenantConfig = {
//     success: boolean
//     data: TenantConfigType
//   }

export const tenantDialer = {
    getItem: async (id: string) => {
        // try {
        //     const tokenMaster = await crmAthan.tokenMaster() || '';
            
        //     return await fetch(`${baseUrl}/tenant/read/${id}`, {
        //         method: 'GET',
        //         headers: { 'Authorization': tokenMaster },
        //     }).then(response => response.json()) as DataTenantConfig;
        // } catch(err) {
        //     if(err instanceof Error)
        //     console.error('tenantCrm.getItem: ', err.message); 
        // }
    }
}