import { requestAppJson } from '../requestAppJson';
import { ContactsLogType } from '../../types/dialer/contacts';
import { PaginationType } from '../../types/pagination';
import { RecordGlobal } from '../../types/record';

const baseUrl = process.env.FLEX_APP_DIALER_BASE_URL;

type LogPageType = {
    success: boolean;
    data: {
        rows: ContactsLogType[]
        pagination: PaginationType;
    }
}

export const contacts = {
    logPage: async (params: RecordGlobal) => {
        try {
            return await requestAppJson(
                'GET',
                `${baseUrl}/contact/log/pagination`,
                params
            ) as LogPageType;
        } catch(err) {
            if(err instanceof Error)
            console.error('contacts.logPage: ', err.message);
        }
    }
}