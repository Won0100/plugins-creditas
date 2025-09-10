import { Add, Cancel, Edit, Save } from "@mui/icons-material";
import * as MUI from "@mui/material";
import { TableAgentInactivity } from "components/Tables/TableWorkerInactivity";
import { useEffect, useState } from "react";
import { userInstance } from "services/manager/user";
import { readDocumentData } from "services/syncClient";
import {
  readMapData as readAgentInactivityMapData,
  updateMap as updateAgentInactivityMapData,
} from "services/sync/workerInactivity";
import {
  readMapData as readCustomerInactivityMapData,
  updateMap as updateCustomerInactivityMapData,
} from "services/sync/customerInactivity";
import { TeamsItemType, TeamsType } from "types/teams";
import { Backdrop } from "../../../../components/Backdrop";
import { CustomButton } from "../../../../components/Custom/CustomButton";
import { PageLayout } from "../../../../components/PageLayout";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { SimpleTitle } from "../../../commonStyled";
import { ConfigNavigation } from "../ConfigNavigation";
import { AgentInactivityMapWithKey } from "types/worker";
import { TableCustomerInactivity } from "components/Tables/TableCustomerInactivity";
import { CustomerInactivityMapWithKey } from "types/customer";

type Props = {
  slug: string;
};

export const InactivityManager = ({ slug }: Props) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editAgentInactivity, setEditAgentInactivity] = useState(false);
  const [editCustomerInactivity, setEditCustomerInactivity] = useState(false);
  const [dataAgentInactivity, setDataAgentInactivity] = useState<
    AgentInactivityMapWithKey[]
  >([]);
  const [dataCustomerInactivity, setDataCustomerInactivity] = useState<
    CustomerInactivityMapWithKey[]
  >([]);
  const [teams, setTeams] = useState<TeamsItemType[]>([]);

  const { throwAlert } = useSnackbar();

  useEffect(() => {
    async function initializeStates() {
      return await Promise.all([
        getDocumentTeams(),
        getAgentInactivityMap(),
        getCustomerInactivityMap(),
      ]);
    }

    initializeStates();
  }, []);

  const getDocumentTeams = async () => {
    setLoading(true);

    const manager = userInstance.getInstance();

    const document = await readDocumentData<TeamsType>(
      `teams-${manager.serviceConfiguration.account_sid}`
    );

    if (document) {
      setTeams(document.teams);
    }
    setLoading(false);
  };

  const getAgentInactivityMap = async () => {
    setLoading(true);

    const agentInactivityMapData = await readAgentInactivityMapData(true);

    if (agentInactivityMapData) {
      setDataAgentInactivity(agentInactivityMapData);
    }
    setLoading(false);
  };

  const getCustomerInactivityMap = async () => {
    setLoading(true);

    const customerInactivityMapData = await readCustomerInactivityMapData(true);

    if (customerInactivityMapData) {
      setDataCustomerInactivity(customerInactivityMapData);
    }
    setLoading(false);
  };

  const handleAddItemCustomerInactivity = () => {
    const anchorArray = [...dataCustomerInactivity];

    anchorArray.push({
      key: "",
      timer: 0,
    });

    setDataCustomerInactivity(anchorArray);
  };

  const handleChangeDataCustomerInactivity = (
    key: string,
    field: string,
    value: string | number
  ) => {
    const anchorArray = [...dataCustomerInactivity];

    if (field === "key") {
      const checkIfValueAlreadyExists = anchorArray.find(
        (item: any) => item.key === value
      );

      if (checkIfValueAlreadyExists) {
        throwAlert(
          "error",
          `Já existe uma configuração para o item selecionado`
        );
        return;
      }
    }

    const itemToUpdate = anchorArray.findIndex((item: any) => item.key === key);

    if (itemToUpdate !== -1) {
      anchorArray[itemToUpdate] = {
        ...anchorArray[itemToUpdate],
        [field]: value,
      };
    }

    setDataCustomerInactivity(anchorArray);
  };

  const handleDeleteItemDataCustomerInactivity = (key: string) => {
    const anchorArray = [...dataCustomerInactivity];
    const newState = anchorArray.filter((item: any) => item.key !== key);

    setDataCustomerInactivity(newState);
  };

  const handleSaveCustomerInactivity = async () => {
    setLoadingSave(true);
    const response = await updateCustomerInactivityMapData(
      dataCustomerInactivity
    );

    if (!response.success) {
      throwAlert("error", response.message);
      setLoadingSave(false);
      return;
    }

    throwAlert("success", "Painel de dados da tarefa atualizado!");

    setEditCustomerInactivity(false);

    setLoadingSave(false);
  };

  const handleCancelEditionCustomerInactivity = async () => {
    await getCustomerInactivityMap();

    setEditCustomerInactivity(false);
  };

  const handleEditionCustomerInactivity = () => {
    setEditCustomerInactivity(true);
  };

  const handleAddItemAgentInactivity = () => {
    const anchorArray = [...dataAgentInactivity];

    anchorArray.push({
      key: "",
      first: 0,
      recurrent: 0,
    });

    setDataAgentInactivity(anchorArray);
  };

  const handleChangeDataAgentInactivity = (
    key: string,
    field: string,
    value: string | number
  ) => {
    const anchorArray = [...dataAgentInactivity];

    if (field === "key") {
      const checkIfValueAlreadyExists = anchorArray.find(
        (item: any) => item.key === value
      );

      if (checkIfValueAlreadyExists) {
        throwAlert(
          "error",
          `Já existe uma configuração para o item selecionado`
        );
        return;
      }
    }

    const itemToUpdate = anchorArray.findIndex((item: any) => item.key === key);

    if (itemToUpdate !== -1) {
      anchorArray[itemToUpdate] = {
        ...anchorArray[itemToUpdate],
        [field]: value,
      };
    }

    setDataAgentInactivity(anchorArray);
  };

  const handleDeleteItemDataAgentInactivity = (key: string) => {
    const anchorArray = [...dataAgentInactivity];
    const newState = anchorArray.filter((item: any) => item.key !== key);

    setDataAgentInactivity(newState);
  };

  const handleSaveAgentInactivity = async () => {
    setLoadingSave(true);
    const response = await updateAgentInactivityMapData(dataAgentInactivity);

    if (!response.success) {
      throwAlert("error", response.message);
      setLoadingSave(false);
      return;
    }

    throwAlert("success", "Painel de dados da tarefa atualizado!");

    setEditAgentInactivity(false);

    setLoadingSave(false);
  };

  const handleCancelEditionAgentInactivity = async () => {
    await getAgentInactivityMap();

    setEditAgentInactivity(false);
  };

  const handleEditionAgentInactivity = () => {
    setEditAgentInactivity(true);
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
                <SimpleTitle margin="0">
                  Configuração de inatividade do agente
                </SimpleTitle>
                {editAgentInactivity ? (
                  <>
                    <CustomButton
                      value="Salvar"
                      Icon={Save}
                      width="auto"
                      disabled={loadingSave}
                      onClick={handleSaveAgentInactivity}
                    />
                    <CustomButton
                      value="Adicionar"
                      Icon={Add}
                      width="auto"
                      onClick={handleAddItemAgentInactivity}
                      disabled={loadingSave}
                    />
                    <CustomButton
                      value="Cancelar"
                      Icon={Cancel}
                      width="auto"
                      onClick={handleCancelEditionAgentInactivity}
                      disabled={loadingSave}
                    />
                  </>
                ) : (
                  <CustomButton
                    value="Editar"
                    Icon={Edit}
                    width="auto"
                    onClick={handleEditionAgentInactivity}
                    disabled={loadingSave}
                  />
                )}
              </MUI.Stack>
              <TableAgentInactivity
                data={dataAgentInactivity}
                edit={editAgentInactivity}
                handleChangeData={handleChangeDataAgentInactivity}
                loading={loading}
                handleDeleteItemData={handleDeleteItemDataAgentInactivity}
                teams={teams}
              />
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
                <SimpleTitle margin="0">
                  Configuração de inatividade do cliente
                </SimpleTitle>
                {editCustomerInactivity ? (
                  <>
                    <CustomButton
                      value="Salvar"
                      Icon={Save}
                      width="auto"
                      disabled={loadingSave}
                      onClick={handleSaveCustomerInactivity}
                    />
                    <CustomButton
                      value="Adicionar"
                      Icon={Add}
                      width="auto"
                      onClick={handleAddItemCustomerInactivity}
                      disabled={loadingSave}
                    />
                    <CustomButton
                      value="Cancelar"
                      Icon={Cancel}
                      width="auto"
                      onClick={handleCancelEditionCustomerInactivity}
                      disabled={loadingSave}
                    />
                  </>
                ) : (
                  <CustomButton
                    value="Editar"
                    Icon={Edit}
                    width="auto"
                    onClick={handleEditionCustomerInactivity}
                    disabled={loadingSave}
                  />
                )}
              </MUI.Stack>
              <TableCustomerInactivity
                data={dataCustomerInactivity}
                edit={editCustomerInactivity}
                handleChangeData={handleChangeDataCustomerInactivity}
                loading={loading}
                handleDeleteItemData={handleDeleteItemDataCustomerInactivity}
                teams={teams}
              />
            </MUI.Box>
          </MUI.Stack>
        </MUI.Box>
      </MUI.Stack>

      <Backdrop loading={loading || loadingSave} />
    </PageLayout>
  );
};
