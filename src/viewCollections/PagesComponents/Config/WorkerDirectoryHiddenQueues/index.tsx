import { Add, Cancel, Edit, Save } from "@mui/icons-material";
import * as MUI from "@mui/material";
import { TableHiddenWorkerDirectoryQueues } from "components/Tables/TableHiddenWorkerDirectoryQueues";
import { useEffect, useState } from "react";
import { userInstance } from "services/manager/user";
import {
  HiddenFlexQueueChannel,
  readHiddenFlexQueuesDocument,
  updateHiddenFlexQueuesDocument,
} from "services/sync/hiddenWorkerDirectoryQueues";
import { TwilioTaskQueue } from "types/twilio";
import { Backdrop } from "../../../../components/Backdrop";
import { CustomButton } from "../../../../components/Custom/CustomButton";
import { PageLayout } from "../../../../components/PageLayout";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { SimpleTitle } from "../../../commonStyled";
import { ConfigNavigation } from "../ConfigNavigation";
import { ReadHiddenWorkerDirectoryQueuesDocumentReturn } from "types/taskQueues";

type Props = {
  slug: string;
};

export const WorkerDirectoryHiddenQueues = ({ slug }: Props) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editChat, setEditChat] = useState(false);
  const [editVoice, setEditVoice] = useState(false);
  const [dataHiddenWorkerDirectory, setDataHiddenWorkerDirectory] =
    useState<ReadHiddenWorkerDirectoryQueuesDocumentReturn>({
      chat: [],
      voice: [],
    });
  const [queues, setQueues] = useState<TwilioTaskQueue[]>([]);

  const { throwAlert } = useSnackbar();

  useEffect(() => {
    async function initializeStates() {
      return await Promise.all([getQueues(), getHiddenFlexQueuesDocument()]);
    }

    initializeStates();
  }, []);

  const getQueues = async () => {
    setLoading(true);

    const queues = await userInstance.getQueues();

    setQueues(queues);

    setLoading(false);
  };

  const getHiddenFlexQueuesDocument = async () => {
    setLoading(true);

    const hiddenFlexQueuesDocumentData = await readHiddenFlexQueuesDocument();

    if (hiddenFlexQueuesDocumentData) {
      setDataHiddenWorkerDirectory(hiddenFlexQueuesDocumentData);
    }
    setLoading(false);
  };

  const handleAddItem = (channel: HiddenFlexQueueChannel) => {
    const anchorObj = { ...dataHiddenWorkerDirectory };

    const anchorArray = anchorObj[channel];

    const checkIfHasUneditedItem = anchorArray.findIndex((item) => !item);

    if (checkIfHasUneditedItem !== -1) return;

    anchorArray.push("");

    anchorObj[channel] = anchorArray;

    setDataHiddenWorkerDirectory(anchorObj);
  };

  const handleChange = (channel: HiddenFlexQueueChannel, value: string) => {
    const anchorObj = { ...dataHiddenWorkerDirectory };

    const anchorArray = anchorObj[channel];

    const checkIfValueAlreadyExists = anchorArray.find(
      (item) => item === value
    );

    if (checkIfValueAlreadyExists) {
      throwAlert("error", `Essa fila já está configurada para esse canal`);
      return;
    }

    const itemToUpdate = anchorArray.findIndex((item) => !item);

    if (itemToUpdate !== -1) {
      anchorArray[itemToUpdate] = value;
    }

    anchorObj[channel] = anchorArray;

    setDataHiddenWorkerDirectory(anchorObj);
  };

  const handleDelete = (channel: HiddenFlexQueueChannel, value: string) => {
    const anchorObj = { ...dataHiddenWorkerDirectory };

    const anchorArray = anchorObj[channel];

    const newArray = anchorArray.filter((item) => item !== value);

    anchorObj[channel] = newArray;

    setDataHiddenWorkerDirectory(anchorObj);
  };

  const handleSave = async (channel: HiddenFlexQueueChannel) => {
    setLoadingSave(true);

    const response = await updateHiddenFlexQueuesDocument(
      channel,
      dataHiddenWorkerDirectory
    );

    if (!response.success) {
      throwAlert("error", response.message);
      setLoadingSave(false);
      return;
    }

    throwAlert("success", "Painel de dados da tarefa atualizado!");

    toggleEdit(channel, false);

    setLoadingSave(false);
  };

  const handleCancel = async (channel: HiddenFlexQueueChannel) => {
    await getHiddenFlexQueuesDocument();

    toggleEdit(channel, false);
  };

  const toggleEdit = (channel: HiddenFlexQueueChannel, value?: boolean) => {
    if (channel === HiddenFlexQueueChannel.Chat) {
      setEditChat(value || !editChat);
    }
    if (channel === HiddenFlexQueueChannel.Voice) {
      setEditVoice(value || !editVoice);
    }
  };

  return (
    <PageLayout title="Configurações">
      <ConfigNavigation slug={slug} />
      <MUI.Stack direction="row" gap="30px" overflow="hidden">
        <MUI.Box width="100%">
          <MUI.Stack direction="row" gap="30px" height="100%">
            <MUI.Box width="100%">
              <MUI.Stack
                width="100%"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <SimpleTitle margin="0">Filas visíveis para Chat</SimpleTitle>
                {editChat ? (
                  <>
                    <CustomButton
                      value="Salvar"
                      Icon={Save}
                      width="auto"
                      disabled={loadingSave}
                      onClick={() => handleSave(HiddenFlexQueueChannel.Chat)}
                    />
                    <CustomButton
                      value="Adicionar"
                      Icon={Add}
                      width="auto"
                      onClick={() => handleAddItem(HiddenFlexQueueChannel.Chat)}
                      disabled={loadingSave}
                    />
                    <CustomButton
                      value="Cancelar"
                      Icon={Cancel}
                      width="auto"
                      onClick={() => handleCancel(HiddenFlexQueueChannel.Chat)}
                      disabled={loadingSave}
                    />
                  </>
                ) : (
                  <CustomButton
                    value="Editar"
                    Icon={Edit}
                    width="auto"
                    onClick={() =>
                      toggleEdit(HiddenFlexQueueChannel.Chat, true)
                    }
                    disabled={loadingSave}
                  />
                )}
              </MUI.Stack>
              <MUI.Box
                overflow="auto"
                height="calc(100% - 40px)"
                marginBottom="30px"
              >
                <TableHiddenWorkerDirectoryQueues
                  data={dataHiddenWorkerDirectory[HiddenFlexQueueChannel.Chat]}
                  edit={editChat}
                  handleChangeData={handleChange}
                  loading={loading}
                  handleDeleteItemData={handleDelete}
                  queues={queues}
                  channel={HiddenFlexQueueChannel.Chat}
                />
              </MUI.Box>
            </MUI.Box>
          </MUI.Stack>
        </MUI.Box>
        <MUI.Box width="100%">
          <MUI.Stack direction="row" gap="30px" height="100%">
            <MUI.Box width="100%">
              <MUI.Stack
                width="100%"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <SimpleTitle margin="0">Filas visíveis para Voz</SimpleTitle>
                {editVoice ? (
                  <>
                    <CustomButton
                      value="Salvar"
                      Icon={Save}
                      width="auto"
                      disabled={loadingSave}
                      onClick={() => handleSave(HiddenFlexQueueChannel.Voice)}
                    />
                    <CustomButton
                      value="Adicionar"
                      Icon={Add}
                      width="auto"
                      onClick={() =>
                        handleAddItem(HiddenFlexQueueChannel.Voice)
                      }
                      disabled={loadingSave}
                    />
                    <CustomButton
                      value="Cancelar"
                      Icon={Cancel}
                      width="auto"
                      onClick={() => handleCancel(HiddenFlexQueueChannel.Voice)}
                      disabled={loadingSave}
                    />
                  </>
                ) : (
                  <CustomButton
                    value="Editar"
                    Icon={Edit}
                    width="auto"
                    onClick={() =>
                      toggleEdit(HiddenFlexQueueChannel.Voice, true)
                    }
                    disabled={loadingSave}
                  />
                )}
              </MUI.Stack>
              <MUI.Box
                overflow="auto"
                height="calc(100% - 40px)"
                marginBottom="30px"
              >
                <TableHiddenWorkerDirectoryQueues
                  data={dataHiddenWorkerDirectory[HiddenFlexQueueChannel.Voice]}
                  edit={editVoice}
                  handleChangeData={handleChange}
                  loading={loading}
                  handleDeleteItemData={handleDelete}
                  queues={queues}
                  channel={HiddenFlexQueueChannel.Voice}
                />
              </MUI.Box>
            </MUI.Box>
          </MUI.Stack>
        </MUI.Box>
      </MUI.Stack>

      <Backdrop loading={loading || loadingSave} />
    </PageLayout>
  );
};
