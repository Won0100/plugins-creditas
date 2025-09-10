import * as MUI from '@mui/material';
import { ContactsLogType } from '../../../../types/dialer/contacts';
import { PaginationType } from '../../../../types/pagination';
import { CustomPagination } from '../../../../components/Custom/CustomPagination';
import { ContactsLog } from '../../../../components/Tables/ContactsLog';
import { Dispatch } from 'react';

type Props = {
    contactsLog: ContactsLogType[];
    contactsLogPagination: PaginationType
    loadingContacts: boolean;
    page: string;
    setPage: Dispatch<string>;
}

export const Contacts = ({ contactsLog, contactsLogPagination, page, setPage, loadingContacts }: Props) => {    
    return (
        <MUI.Box>
            <ContactsLog 
                contactsLog={contactsLog} 
                loading={loadingContacts}
            />
            <CustomPagination page={page} setPage={setPage} pages={contactsLogPagination.pages} />
        </MUI.Box>
    )
}