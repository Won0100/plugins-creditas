import { ColumnDefinition } from "@twilio/flex-ui";
import { SupervisorWorkerState } from "@twilio/flex-ui/src/state/State.definition";
import { StatusComponent } from './StatusComponent';

export const Status = (
  <ColumnDefinition key="column-definition-status" header={"STATUS"} content={({ worker }: SupervisorWorkerState) => {
    return <StatusComponent worker={worker} />
  }} />
)
