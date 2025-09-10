export type ActivityTimeType = {
  dailyUsage: number;
  lastTimeUsed: number;
};

export type ActivitiesTimesType = {
  [key: string]: ActivityTimeType;
};

export type WorkerConfigsSyncType = {
  data?: { supervisors?: string[]; };
  configDay: string,
  lastActivityName: string,
  activitiesTimes?: ActivitiesTimesType;
};

