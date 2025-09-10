import { RecurrenceType } from "./recurrence"

export type RulerType = {
    ConfigId: number
    channel: string
    configId: number
    id: number
    host?: number
    interval_1: string
    interval_day: string
    template_id?: number
    template_sms_id?: number
    template_email_id?: number
    zenvia_template_id?: number
    name?: string
    content?: string
    message?: string
    template_sid?: string
    type?: string
    attendance?: number
}

export type CampaignItemConfigType = {
    id: number
    campaign_id: number
    type: string
    attendance: number
    start_date: string
    recurrence_id: number
    template_id: number
    template_sms_id?: number
    template_email_id?: number
    zenvia_template_id?: number
    agressiveness: number
    host?: number
    tries_by_phone: string
    day_off: number[]
    createdAt: string
    updatedAt: string
    CampaignId: number
    RecurrenceId: number
    TemplateId: number
    Recurrences: RecurrenceType[]
    Rulers: RulerType[]
}

export type CampaignItemType = {
    id: number
    tenant_config_id: number
    name: string
    last_triggered_date: string
    music_on_hold?: string
    status: string
    subject: string
    sender_pool: boolean
    createdAt: string
    updatedAt: string
    TenantConfigId: number
    ruler: number
    partition: number
    partition_part: number
    Config: CampaignItemConfigType
}

export type CampaignPageItemType = {
    id: number;
    name: string;
    last_triggered_date: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    tenant_config_id: number;
    sender_pool: number;
    music_on_hold: string;
    ruler: number;
    partition: number;
    partition_part: number;
    subject: null,
    type: string;
}

type StatisticCompleted = {    
    total_contacts: number;
    total_completed: number;
    contacts_completed: number;
    percentage: string;
    message: string;
}

type StatisticAccessed = {    
    total_contacts: number;
    total_accessed: number;
    contacts_accessed: number;
    percentage: string;
    message: string;
}

export type JobsType = [
    {
        [key: string]: {
            count: number
            percentage: number
        }
    }
]

type StatisticJobs = {
    total_logs: number
    status: JobsType;
    message: string
}

export type CampaignStatisticsType = {
    completed: StatisticCompleted;
    accessed: StatisticAccessed;
    jobs: StatisticJobs;
}

export type MailingStatisticsType = {    
    mailing_id: number;
    campaign_id: number;
    name: string;
    statistic: {
        mailing: {
            total: StatisticCompleted;
            message: string;
        },
        mailing_accessed: {
            total: StatisticAccessed;
            message: string;
        },
        jobs: {
            total: StatisticJobs;
            message: string;
        }
    }    
}

export type TenantStatisticsType = {
    completed: StatisticCompleted;
    accessed: StatisticAccessed;
    jobs: StatisticJobs;
}

export type CampaignType = {
    id?: number;
    name?: string;
    last_triggered_date?: string;
    status?: string;
    tenant_config_id?: number;
    music_on_hold?: string;
    ruler?: string;
    partition?: number;
    partition_part?: number;
    subject?: string;
}

export type ConfigType = {
    id?: number;
    type?: string;
    attendance?: number;
    attendanceType?: string;
    start_date?: string;
    agressiveness?: string;
    tries_by_phone?: number | null;
    template_id?: number | null;
    day_off?: number[];
    template_sms_id?: number | null;
    template_email_id?: number | null;
    zenvia_template_id?: number | null;
    host?: number;
}

export type PayloadCampaignType = {
    campaign?: CampaignType;
    config?: ConfigType;    
}