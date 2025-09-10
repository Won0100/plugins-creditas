import { Dispatch } from "react";

export type ActivitiesSyncType = {    
    [key: string]: {        
        [key: string]: {
            dailyUsageLimit: number | null | undefined;
            minTime: number;
            maxTime: number;
        }
    }
}

export type TeamsActivitiesDataType = {
    data: ActivitiesSyncType;
    index?: number;
}

export type ActivityColorType = {
    [key: string]: {
        color: string;
        bgColor: string;
    }
}

export type ActiveTeamsContextType = {
    activeTeamsSync: TeamsActivitiesDataType[];
    getActiveTeamsSync: () => Promise<void>;
    setActiveTeamsSync: Dispatch<TeamsActivitiesDataType[]>;
}
