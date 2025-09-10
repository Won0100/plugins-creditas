import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { userInstance } from "services/manager/user";
import { readDowntimeConfigMap } from "services/sync/downtimeConfig";
import { CustomTabPanel } from "../../../../components/Custom/CustomTabPanel";
import { EmergencyConfig } from "../../../../components/DowntimeManager/EmergencyConfig";
import { HolidayConfig } from "../../../../components/DowntimeManager/HolidayConfig";
import { PartialDayConfig } from "../../../../components/DowntimeManager/PartialDayConfig";
import { WeeklyConfig } from "../../../../components/DowntimeManager/WeeklyConfig";
import { PageLayout } from "../../../../components/PageLayout";
import {
  createDowntimeConfigMutex,
  hasCreatedDowntimeConfigMutex,
  releaseDowntimeConfigMutex,
  updateDowntimeConfig,
} from "../../../../helpers/downtimeManager/downtimeConfigService";
import { ConfigNavigation } from "../ConfigNavigation";
import FifoLifoToggle from '../../../../components/FifoLifo';
import { updateQueueOrder, QueueOrder } from "../../../../services/fifoLifoService";

type Props = {
  slug: string;
};

type TeamScheduleConfig = {
  regularHours?: ComponentsConfigProps["value"];
  emergencySettings?: ComponentsConfigProps["value"];
  holidays?: ComponentsConfigProps["value"];
  partialDays?: ComponentsConfigProps["value"];
};

type ComponentsConfigProps = {
  value: any;
  addToStagedChanges?: (v: any) => void;
  isReadOnly: boolean;
};

export const DowntimeManager = ({ slug }: Props) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [value, setValue] = React.useState(0);
  const [teamScheduleConfig, setTeamScheduleConfig] =
    useState<TeamScheduleConfig>({});
  const [unpublishedContent, setUnpublishedContent] = useState<
    Record<string, any>
  >({});

  const [showInProgress, setShowInProgress] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");
  const [selectedQueue, setSelectedQueue] = useState("Everyone");
  const [queues, setQueues] = useState<any[]>([]);
  const [queueOrder, setQueueOrderState] = useState<QueueOrder>('FIFO');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const loadExistingData = async (documentQueueName = null) => {
    setShowInProgress(true);
    const existingData: any = await readDowntimeConfigMap(
      documentQueueName || selectedQueue
    );
    setTeamScheduleConfig(existingData || {});
    setQueueOrderState(existingData?.TaskOrder === 'LIFO' ? 'LIFO' : 'FIFO');
    const hasCreatedMutex = await hasCreatedDowntimeConfigMutex();
    if (
      hasCreatedMutex.status === 200 &&
      hasCreatedMutex.data.hasExistingMutex
    ) {
      setIsReadOnly(false);
    }

    const queues = await userInstance.getQueues();
    setQueues(queues);

    setShowInProgress(false);
  };

  useEffect(() => {
    loadExistingData();
  }, []);

  const handleAddToUnpublishedChanges = (groupName: string) => {
    return (v: any) => {
      setUnpublishedContent((d) => {
        return { ...d, [groupName]: v };
      });
    };
  };

  const clearAlerts = () => {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setDisplayMessage("");
  };

  const handleBeginEdit = async () => {
    setShowInProgress(true);
    const lockStatus = await createDowntimeConfigMutex();
    if (lockStatus.status === 200) {
      await loadExistingData();
      setIsReadOnly(false);
    } else {
      setShowErrorMessage(true);
      setDisplayMessage(
        `Existe um usuário alterando as configurações de horário`
      );
    }
    setShowInProgress(false);
  };

  const handlePublishChanges = async () => {
    setShowInProgress(true);
    const mergedData = {
      ...teamScheduleConfig,
      ...unpublishedContent,
      timezone: "America/Sao_Paulo",
      queueName: selectedQueue,
      TaskOrder: queueOrder,
    };

    // Update queue order in Twilio
    const selectedQueueObj = queues.find(queue => queue.name === selectedQueue);
    if (!selectedQueueObj) {
      setShowErrorMessage(true);
      setDisplayMessage("Fila não encontrada");
      setShowInProgress(false);
      return;
    }
    
    const updateQueueResult = await updateQueueOrder(selectedQueueObj.sid, queueOrder);
    if (!updateQueueResult.success) {
      setShowErrorMessage(true);
      setDisplayMessage("Erro ao atualizar a ordem da fila");
      setShowInProgress(false);
      return;
    }

    const updateResponse = await updateDowntimeConfig(mergedData);
    if (updateResponse.status === 200) {
      setShowSuccessMessage(true);
      setDisplayMessage("A configuração foi atualizada com sucesso!");
      setUnpublishedContent({});
    } else {
      setShowErrorMessage(true);
      setDisplayMessage(
        "Desculpe, ocorreu um problema ao atualizar a configuração"
      );
    }

    await loadExistingData();
    await releaseDowntimeConfigMutex();
    setIsReadOnly(true);
    setShowInProgress(false);

    setTimeout(() => {
      clearAlerts();
    }, 3500);
  };

  const handleCancelChanges = async () => {
    setShowInProgress(true);
    await releaseDowntimeConfigMutex();
    await loadExistingData();
    setUnpublishedContent({});
    setIsReadOnly(true);
    setShowInProgress(false);
  };

  const handleUpdateQueue = (key: any) => {
    setSelectedQueue(key.target.value);
    loadExistingData(key.target.value);
  };

  return (
    <PageLayout title="Configuração de filas">
      <ConfigNavigation slug={slug} />
      {showSuccessMessage && (
        <Alert onClose={clearAlerts} severity="success">
          {displayMessage}
        </Alert>
      )}
      {showErrorMessage && (
        <Alert onClose={clearAlerts} severity="error">
          {displayMessage}
        </Alert>
      )}

      <Box sx={{ padding: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <h1>Configuração de horários</h1>

          {isReadOnly ? (
            <Button variant="contained" onClick={handleBeginEdit}>
              Editar configurações
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handlePublishChanges}>
                Publicar as alterações
              </Button>
              <Button variant="outlined" onClick={handleCancelChanges}>
                Cancelar as alterações
              </Button>
            </Stack>
          )}
        </Stack>

        <FormControl sx={{ width: 300, marginTop: 2 }}>
          <InputLabel>Fila</InputLabel>
          <Select
            label="Fila"
            value={selectedQueue}
            onChange={handleUpdateQueue}
          >
            {queues.map((queue) => (
              <MenuItem key={queue.name} value={queue.name ?? ""}>
                {queue.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mt: 2,
          border: '1px solid #c2c2c2',
          padding: 1,
          borderRadius: 1,
          width: 'fit-content',
          transition: 'border-color 0.2s, opacity 0.2s',
          '&:hover': {
            borderColor: '#fff',
          },
          opacity: isReadOnly ? 0.5 : 1, // Faded when read-only
          cursor: isReadOnly ? 'not-allowed' : 'default', // Blocked pointer when read-only
          pointerEvents: isReadOnly ? 'auto' : 'auto', // Allow pointer events for tooltip, etc.
        }}
      >
        <span style={{ color: 'normal', fontWeight: 'bold' }}>ORDENAÇÃO</span>
        <FifoLifoToggle value={queueOrder} onChange={setQueueOrderState} disabled={isReadOnly} />
      </Box>

        <br />

        <Tabs value={value} onChange={handleChange}>
          <Tab label="Horário de operação" />
          <Tab label="Tempo de inatividade de emergência" />
          <Tab label="Feriados" />
          <Tab label="Dias parciais" />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <WeeklyConfig
            value={teamScheduleConfig.regularHours}
            addToStagedChanges={handleAddToUnpublishedChanges("regularHours")}
            isReadOnly={isReadOnly}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <EmergencyConfig
            value={teamScheduleConfig.emergencySettings}
            addToStagedChanges={handleAddToUnpublishedChanges(
              "emergencySettings"
            )}
            isReadOnly={isReadOnly}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <HolidayConfig
            value={teamScheduleConfig.holidays}
            addToStagedChanges={handleAddToUnpublishedChanges("holidays")}
            isReadOnly={isReadOnly}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <PartialDayConfig
            value={teamScheduleConfig.partialDays}
            addToStagedChanges={handleAddToUnpublishedChanges("partialDays")}
            isReadOnly={isReadOnly}
          />
        </CustomTabPanel>
      </Box>

      <Modal
        open={showInProgress}
        onClose={() => {}}
        aria-labelledby="loader-modal"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 170,
          }}
        >
          <CircularProgress />
        </Box>
      </Modal>
    </PageLayout>
  );
};
