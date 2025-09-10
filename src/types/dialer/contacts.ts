type Campaign = {
    id: number;
    name: string;
    status: string;
    music_on_hold: string;
    TenantConfig: {
        tenant_id: string;
        TenantNumbers: [{
            phone_number: string;
        }]
    },
    Config: {
        type: string;
    }
}

type LogType = {
    id: number;
    name: string;
    email: string;
    cpf: string;
    tenant_config_id: number;
    phones: [{
        phone_number: string;
    }]
}

type MailingType = {
    id: number;
    name: string;
    status_disable_contact: string;
    queue: string;
    phone: string;
}

export type ContactsLogType = {    
    id: number;
    sent_date: string;
    delivered_date: string;
    read_date: string;
    message_sid: string;
    message_callback_error: string;
    contact_id: number;
    campaign_id: number;
    mailing_id: number;
    createdAt: string;
    status: string;
    updatedAt: string;
    contact_phone: string;
    tenant_phone: string;
    contact_email: null,
    tenant_email: null,
    dinamic_ruler: number;
    host: number;
    channel: string;
    tabulation: null,
    channel_default: string;
    CampaignId: number;
    ContactId: number;
    logId: number;
    MailingId: number;
    Campaign: Campaign;
    log: LogType;
    Mailing: MailingType;
}
