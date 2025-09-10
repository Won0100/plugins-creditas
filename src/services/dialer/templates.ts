import { requestAppJson } from '../requestAppJson';
import { TemplateType } from '../../types/dialer/templates';

const baseUrl = process.env.FLEX_APP_DIALER_BASE_URL;

export const templates = {
    list: async () => {
        await requestAppJson('PATCH', `${baseUrl}/template/import`);

        return await requestAppJson(
            'GET',
            `${baseUrl}/template/list`            
        ) as TemplateType[]
    }
}