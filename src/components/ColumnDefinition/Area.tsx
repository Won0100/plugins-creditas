import { ColumnDefinition } from "@twilio/flex-ui";
import { SupervisorWorkerState } from "@twilio/flex-ui/src/state/State.definition";

export const Area = (
  <ColumnDefinition key="column-definition-area" header={"ÁREA"} content={({ worker }: SupervisorWorkerState) => <>{ worker.attributes?.area }</>} />
)
