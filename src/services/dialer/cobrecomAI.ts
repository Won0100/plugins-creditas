import { requestAppJson } from '../requestAppJson';
import { CobrecomRobotType } from '../../types/dialer/cobrecomAI';
import { PaginationType } from '../../types/pagination';

const baseUrl = process.env.FLEX_APP_DIALER_BASE_URL;

type GetPageType = {
    success: boolean;
    data: {
        rows: CobrecomRobotType[];
        pagination: PaginationType;
    };
}

export const cobrecomAI = {
    getPage: async (tenantId: string) => {
        try {
            return await requestAppJson(
                'GET',
                `${baseUrl}/campaign/pagination`,
                { page: '0', pageSize: '200', tenant_id: tenantId }
            ) as GetPageType;
        } catch(err) {
            if(err instanceof Error)
            console.error('cobrecomAI.getPage: ', err.message);
        }
    }
}