export type ActivityTimeType = {
    dailyUsage: number;
    lastTimeUsed: number;
};

export type ActivitiesTimesType = {
    [key: string]: ActivityTimeType;
};

export type WorkerDialerConfigItemType = {
    workerSid: string;
    callerId: string;
    techPrefix: string;
    ipAddress: string;
    destNumbers: string[];
};

export type WorkerDialerConfigSyncType = {
    data: WorkerDialerConfigItemType[];
};

export type WorkerConfigsSyncType = {
    data?: { supervisors?: string[]; };
    configDay: string,
    lastActivityName: string,
    activitiesTimes?: ActivitiesTimesType;
};