import { Box } from "@mui/material";
import { ColumnDefinition } from "@twilio/flex-ui";
import { SupervisorWorkerState } from "@twilio/flex-ui/src/state/State.definition";

export const Team = (
  <ColumnDefinition key="column-definition-team" header={"EQUIPE"} content={({ worker }: SupervisorWorkerState) => <>{ worker.attributes?.team }</>} />
)
