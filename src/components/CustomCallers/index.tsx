import * as MUI from "@mui/material";
import { Manager } from "@twilio/flex-ui";
import { CustomSelect } from "../Custom/CustomSelect";
import { useEffect, useState } from "react";

export const CustomCallers = () => {
  const manager = Manager.getInstance();
  const [callerId, setCallerId] = useState<string>(
    manager.serviceConfiguration.attributes?.outbound_callers_id?.[0].value ?? ""
  );
  const [queues, setQueues] = useState<any>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>("");

  async function getQueues() {
    const queuesMap = await manager.workspaceClient?.fetchTaskQueues();

    if (queuesMap) {
      const queuesData = Array.from(queuesMap, ([key, value]) => ({
        key,
        value,
      }));

      setSelectedQueue(queuesData[0].value.queueSid);

      setQueues(
        queuesData.map((queue) => ({
          value: queue.value.queueSid,
          label: queue.value.queueName,
        }))
      );
    }
  }

  useEffect(() => {
    getQueues();
  }, []);

  return (
    <MUI.Stack marginTop={2}>
      <CustomSelect
        id="queue-select-outbound-call"
        label="Selecione uma fila"
        placeholder="Selecione uma fila"
        value={selectedQueue}
        width="28ch"
        margin="1rem 0"
        setValue={setSelectedQueue}
        options={queues}
      />
      <MUI.Divider />
      <CustomSelect
        id="caller-id-select-outbound-call"
        label="Selecione uma operadora"
        placeholder="Selecione uma operadora"
        value={callerId}
        width="28ch"
        margin="1rem 0"
        setValue={setCallerId}
        options={manager.serviceConfiguration.attributes?.outbound_callers_id ?? []}
      />
    </MUI.Stack>
  );
};
