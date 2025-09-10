export interface AgentInactivityMap {
  first: number;
  recurrent: number;
}

export type AgentInactivityMapWithKey = AgentInactivityMap & {
  key: string;
};

export type ReadAgentInactivityMapReturn = {
  alertMapKey: string;
  alerts: AgentInactivityMap;
};
