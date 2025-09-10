import { FormatListBulleted, Save } from "@mui/icons-material";
import * as MUI from "@mui/material";
import { TaskRouterQueue } from "@twilio/flex-ui/src/core/FlexDataClient";
import { useEffect, useState } from "react";
import { Backdrop } from "../../../../components/Backdrop";
import { CustomButton } from "../../../../components/Custom/CustomButton";
import { CustomMultiSelect } from "../../../../components/Custom/CustomMultiSelect";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { userInstance } from "../../../../services/manager/user";
import { serviceConfiguration } from "../../../../services/serviceConfiguration";

export const HiddenQueues = () => {
  const [hiddenQueues, setHiddenQueues] = useState<string[]>([]);
  const [queues, setQueues] = useState<TaskRouterQueue[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceConfigurationManager, setServiceConfigurationManager] =
    useState(userInstance.getInstance());

  const { throwAlert } = useSnackbar();

  useEffect(() => {
    if (serviceConfigurationManager) {
      (async () => {
        const data = await userInstance.getQueues();
        setQueues(data);
        await getDocument();
      })();
    }
  }, [serviceConfigurationManager]);

  const getDocument = async () => {
    setLoading(true);
    const queuesManager =
      serviceConfigurationManager.serviceConfiguration.attributes?.hiddenQueues;

    if (queuesManager) {
      setHiddenQueues(queuesManager);
    }
    setLoading(false);
  };

  const save = async () => {
    setLoading(true);

    const response = await serviceConfiguration.update({
      hiddenQueues,
    });

    if (response?.account_sid) {
      throwAlert("success", "Filas visíveis atualizadas!");
      setTimeout(() => window.location.reload(), 4000);
    }

    setLoading(false);
  };

  return (
    <MUI.Stack direction="column">
      <MUI.Box marginTop="20px">
        <CustomMultiSelect
          width="100%"
          label="Filas visíveis"
          placeholder="Filas visíveis"
          value={hiddenQueues}
          Icon={FormatListBulleted}
          options={queues?.map((item) => {
            return {
              label: item.name as string,
              value: item.name as string,
            };
          })}
          setValue={(e) => setHiddenQueues(e)}
        />
      </MUI.Box>
      <CustomButton
        value="Salvar"
        Icon={Save}
        margin="20px 0"
        onClick={save}
        disabled={loading}
      />
      <Backdrop loading={loading} />
    </MUI.Stack>
  );
};
