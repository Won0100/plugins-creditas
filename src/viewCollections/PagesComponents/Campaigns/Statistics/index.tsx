import { PageLayout } from '../../../../components/PageLayout';
import * as MUI from '@mui/material';
import { SimpleBox, SimpleTitle, NoData } from '../../../commonStyled';
import { CustomBreadcrumb } from '../../../../components/Custom/CustomBreadcrumb';
import { useEffect, useState } from 'react';
import { location } from '../../../../helpers/location';
import { campaigns } from '../../../../services/dialer/campaigns';
import { contacts } from '../../../../services/dialer/contacts';
import { Campaign } from './Campaign';
import { CampaignStatisticsType, MailingStatisticsType } from '../../../../types/dialer/campaigns';
import { ContactsLogType } from '../../../../types/dialer/contacts';
import { PaginationType } from '../../../../types/pagination';
import { Contacts } from './Contacts';
import { Mailing } from './Mailing';
import { Backdrop } from '../../../../components/Backdrop';
import { RecordGlobal } from '../../../../types/record';
import { CustomButton } from '../../../../components/Custom/CustomButton';
import { invokeAction } from '../../../../actions/invoke';
import { ArrowBack } from '@mui/icons-material';
import { OnFilter } from './OnFilter';

export const Statistics = () => {
    const [campaign, setCampaign] = useState<CampaignStatisticsType | null>();
    const [mailings, setMailings] = useState<MailingStatisticsType[]>([]);
    
    const [contactsLog, setContactsLog] = useState<ContactsLogType[]>([]);
    const [contactsLogPagination, setContactsLogPagination] = useState<PaginationType | null>();
    const [page, setPage] = useState('0');

    const [loadingStatistics, setLoadingStatistics] = useState(false);
    const [loadingContacts, setLoadingContacts] = useState(false);

    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [campaignIdFilter, setCampaignIdFilter] = useState('');
    const [mailingIdFilter, setMailingIdFilter] = useState('');
    const [channel, setChannel] = useState('');
    const [tenantId, setTenantId] = useState('');

    const campaignId = location.getParam('id') as string;

    useEffect(() => {
        (async () => await handleStatistics())();
    }, [campaignId])

    useEffect(() => {
        (async () => await handleContactLog())();
    }, [campaignId, page])

    const handleStatistics = async () => {        
        setLoadingStatistics(true);

        const params: RecordGlobal = {};

        if(campaignId) params.campaignId = campaignId;
        if(campaignIdFilter) params.campaignId = campaignIdFilter;
        if(mailingIdFilter) params.mailingId = mailingIdFilter;
        if(tenantId) params.tenant_id = tenantId;
        if(dateStart) params.startDate = dateStart;
        if(dateEnd) params.endDate = dateEnd;        
        if(channel) params.channel = channel;        
        
        const statistics = await campaigns.getStatistic(params);            
        
        setCampaign(statistics?.campaignStatistics || statistics?.tenantStatistics || null);        
        setMailings(statistics?.mailingStatistics?.slice(0, 10) || []);
        setLoadingStatistics(false);
    }

    const handleContactLog = async () => {        
        setLoadingContacts(true);

        const params: RecordGlobal = {
            page,
            pageSize: '10'
        };

        if(campaignId) params.campaign_id = campaignId;
        if(campaignIdFilter) params.campaign_id = campaignIdFilter;
        if(mailingIdFilter) params.mailing_id = mailingIdFilter;        
        if(dateStart) params.startDate = dateStart;
        if(dateEnd) params.endDate = dateEnd;        
        if(channel) params.type = channel;        
        if(tenantId) params.tenant_id = tenantId        

        const contactsLogPage = await contacts.logPage(params);            
        
        setContactsLog(contactsLogPage?.data.rows || []);
        setContactsLogPagination(contactsLogPage?.data.pagination || null);        
        setLoadingContacts(false);
    }

    const onFilter = async () => {        
        setPage('0');
        await Promise.all([handleStatistics(), handleContactLog()]);
    }

    return (
        <PageLayout            
            Breadcrumb={
                <CustomBreadcrumb 
                    title="Campanhas"
                    subtitle={
                        campaignId
                        ? `Estatísticas ${campaignId}`
                        : 'Estatísticas Globais'
                    }
                    path="dialer-campaigns"
                />
            }
            ButtonsActions={
                <CustomButton
                    value="Voltar"
                    onClick={() => invokeAction.navigateToView('dialer-campaigns')}
                    Icon={ArrowBack}
                />
            }
        >
            <OnFilter
               dateStart={dateStart}
               setDateStart={setDateStart}
               dateEnd={dateEnd}
               setDateEnd={setDateEnd}
               campaignId={campaignId}
               campaignIdFilter={campaignIdFilter}
               setCampaignIdFilter={setCampaignIdFilter}
               mailingIdFilter={mailingIdFilter}
               setMailingIdFilter={setMailingIdFilter}
               channel={channel}
               setChannel={setChannel}
               tenantId={tenantId}
               setTenantId={setTenantId}
               onFilter={onFilter}
            />
            {campaign &&
                <MUI.Box>
                    <SimpleBox>
                        <SimpleTitle>
                            {
                                !!campaignId
                                ? 'Campanha'
                                : 'Campanhas'
                            }
                        </SimpleTitle>
                        {!!campaign && <Campaign campaign={campaign} />}
                    </SimpleBox>
                    <SimpleBox>
                        <SimpleTitle>Contatos</SimpleTitle>
                        {!!(contactsLog && contactsLogPagination) &&
                            <Contacts 
                                contactsLog={contactsLog}  
                                contactsLogPagination={contactsLogPagination}
                                loadingContacts={loadingContacts}
                                page={page}
                                setPage={setPage}
                            />                                        
                        }
                    </SimpleBox>                        
                    <SimpleBox>
                        <SimpleTitle>Mailings</SimpleTitle>      
                        {mailings.length > 0 &&
                            <Mailing mailings={mailings} />
                        }          
                    </SimpleBox>
                </MUI.Box>
            }                   
            {(!loadingStatistics && !campaign) &&
                <NoData>Sem estatísticas!</NoData>
            }
            <Backdrop loading={loadingStatistics} />
        </PageLayout>
    )
}