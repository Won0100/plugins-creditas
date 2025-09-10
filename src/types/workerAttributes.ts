import { WorkerAttributes } from "@twilio/flex-ui";

export interface CustomWorkerAttributes extends WorkerAttributes {
  area?: string;
  active?: boolean;
  department?: string;
  department_id?: string;
  equipe?: string;
  state?: string;
  team?: string;
  team_id?: string;
}
