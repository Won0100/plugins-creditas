import { requestAppJson } from '../requestAppJson';
import { 
    CampaignPageItemType, 
    CampaignStatisticsType, 
    MailingStatisticsType,
    TenantStatisticsType,
    PayloadCampaignType,
    CampaignItemType 
} from '../../types/dialer/campaigns';
import { PaginationType } from '../../types/pagination';
import { RecordGlobal } from '../../types/record';

const baseUrl = process.env.FLEX_APP_DIALER_BASE_URL;

type GetPageType = {
    success: boolean;
    data: {
        rows: CampaignPageItemType[];
        pagination: PaginationType;
    }
}

type CampaignItemDataType = {
    success: boolean
    data: CampaignItemType
    message?: {
      status: number
      message: string
    }
  }

type GetStatisticType = {
    success: boolean;
    campaignStatistics: CampaignStatisticsType;
    mailingStatistics: MailingStatisticsType[];
    tenantStatistics: TenantStatisticsType;
}

type ResponseCampaignType = {
    success: boolean;
    data: CampaignItemType;
    message?: string;
}

export const campaigns = {
    getPage: async (page: string, pageSize: string) => {
        try {
            return await requestAppJson(
                'GET',
                `${baseUrl}/campaign/pagination`,
                { page, pageSize }
            ) as GetPageType;
        } catch(err) {
            if(err instanceof Error)
            console.error('campaigns.getPage: ', err.message);
        }
    },
    getItem: async (id: string) => {
        try {
            return await requestAppJson(
                'GET',
                `${baseUrl}/campaign/read/${id}`                
            ) as CampaignItemDataType;
        } catch(err) {
            if(err instanceof Error)
            console.error('campaigns.create: ', err.message);
        }
    },
    getStatistic: async (params: RecordGlobal) => {
        try {
            return await requestAppJson(
                'GET',
                `${baseUrl}/campaign/statistics`,
                params
            ) as GetStatisticType;
        } catch(err) {
            if(err instanceof Error)
            console.error('campaigns.getStatistic: ', err.message);
        }
    },
    create: async (payload: PayloadCampaignType) => {
        try {
            return await requestAppJson(
                'POST',
                `${baseUrl}/campaign/create`,
                {},
                payload
            ) as ResponseCampaignType;
        } catch(err) {
            if(err instanceof Error)
            console.error('campaigns.create: ', err.message);
        }
    },
    update: async (payload: PayloadCampaignType) => {
        try {
            return await requestAppJson(
                'PUT',
                `${baseUrl}/campaign/update`,
                {},
                payload
            ) as ResponseCampaignType;
        } catch(err) {
            if(err instanceof Error)
            console.error('campaigns.create: ', err.message);
        }
    }    
}