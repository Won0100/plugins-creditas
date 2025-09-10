export type TeamsItemType = {
  department: string;
  id: string;
  name: string;
  queues: string[];
  supervisorsEmail: string[];
};

export type TeamsType = {
  teams: TeamsItemType[];
};
