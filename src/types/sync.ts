export type ServiceSyncType = {
    account_sid: string;
    created_by: string;    
    date_expires: string;
    date_created: string;
    date_updated: string;
    revision: string;
    service_sid: string;
    sid: string;
    unique_name: string;
    url: string;
    links: {
        permissions: string;
    }
}

export type ServiceSyncListType = {        
    account_sid: string;
    created_by: string;
    date_created: string;
    date_expires: string;
    date_updated: string;
    index: 0,
    list_sid: string;
    revision: string;
    service_sid: string;
    url: string;
}

// use extends for data
// interface YourNameType extends ServiceSyncType { data: YourType };