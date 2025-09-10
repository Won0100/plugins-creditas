import * as MUI from "@mui/material";
import { PageLayout } from "../../../../components/PageLayout";
import { ConfigNavigation } from "../ConfigNavigation";
import { SimpleTitle } from "../../../commonStyled";
import { useEffect, useState } from "react";
import { Departments } from "./Departments";
import { Teams } from "./Teams";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { Backdrop } from "../../../../components/Backdrop";
import { v4 as generateId } from "uuid";
import { DepartmentItemType } from "../../../../types/department";
import { TeamsItemType } from "../../../../types/teams";
import { departmentDocument } from "../../../../services/sync/department";
import { teamsDocument } from "../../../../services/sync/teams";
import { ButtonsActions } from "./ButtonsActions";
import { departmentsAndTeams } from "../../../../helpers/departmentsAndTeams";
import { TaskRouterQueue } from "@twilio/flex-ui/src/core/FlexDataClient";
import { readDocumentData } from "services/syncClient";
import { Manager } from "@twilio/flex-ui";
import { userInstance } from "services/manager/user";
import { Tabs as TabsType } from "types/tabs";

type Props = {
  slug: string;
};

export const DepartmentsAndTeams = ({ slug }: Props) => {
  const [loading, setLoading] = useState(false);
  const [editDepartments, setEditDepartments] = useState(false);
  const [editTeams, setEditTeams] = useState(false);
  const [departments, setDepartments] = useState<DepartmentItemType[]>([]);
  const [teams, setTeams] = useState<TeamsItemType[]>([]);
  const [queues, setQueues] = useState<TaskRouterQueue[]>([]);
  const [tabs, setTabs] = useState<TabsType[]>([]);
  const manager = Manager.getInstance();

  const { throwAlert } = useSnackbar();

  useEffect(() => {
    (async () => {
      await Promise.all([
        getDocumentDepartment(),
        getDocumentTeams(),
        getQueues(),
        getTabs(),
      ]);
    })();
  }, []);

  const getQueues = async () => {
    const data = await userInstance.getQueues();
    setQueues(data);
  };

  const getTabs = async () => {
    const tabsUniqueName = `tabs-${manager.serviceConfiguration.account_sid}`;
    const data: any = await readDocumentData(tabsUniqueName);

    if (data && data.tabs) {
      setTabs(data.tabs);
    }
  };

  const addDepartmentItem = () => {
    const newState = [...departments];

    newState.unshift({
      id: generateId(),
      name: "",
      tabs: [],
      activities: [],
    });

    setDepartments(newState);
  };

  const addTeamsItem = () => {
    const newState = [...teams];

    newState.unshift({
      id: generateId(),
      name: "",
      department: "",
      queues: [],
      supervisorsEmail: [],
    });

    setTeams(newState);
  };

  const changeDepartmentItem = (
    id: string,
    key: keyof DepartmentItemType,
    value: string | string[]
  ) => {
    const newState = [...departments];

    if (key === "name") {
      const checkSameName = departmentsAndTeams.checkDepartmentSameNames(
        newState,
        value as string
      );

      if (checkSameName) {
        throwAlert("error", "Já existe uma área com este nome!");
        return;
      }
    }

    const itemUpdate = newState.find((item) => item.id === id);

    if (itemUpdate) itemUpdate[key] = value as string[] & string & TabsType[];

    setDepartments(newState);
  };

  const changeTeamsItem = (
    id: string,
    key: keyof TeamsItemType,
    value: string | string[]
  ) => {
    const newState = [...teams];

    if (key === "name") {
      const checkSameName = departmentsAndTeams.checkTeamsSameNames(
        newState,
        value as string
      );

      if (checkSameName) {
        throwAlert("error", "Já existe um time com este nome!");
        return;
      }
    }

    const itemUpdate = newState.find((item) => item.id === id);

    if (itemUpdate) itemUpdate[key] = value as string[] & string;

    setTeams(newState);
  };

  const deleteDepartmentItem = (id: string) => {
    const newState = [...departments];

    const deleteItem = newState.filter((item) => item.id !== id);

    setDepartments(deleteItem);
  };

  const deleteTeamItem = (id: string) => {
    const newState = [...teams];

    const deleteItem = newState.filter((item) => item.id !== id);

    setTeams(deleteItem);
  };

  const saveDepartment = async () => {
    setLoading(true);
    const response = await departmentDocument.update({
      departments: departments.filter((item) => item.name !== ""),
    });

    if (response) {
      throwAlert("success", "Áreas atualizadas!");
      setEditDepartments(false);
      await getDocumentDepartment();
    }

    setLoading(false);
  };

  const saveTeams = async () => {
    setLoading(true);
    const response = await teamsDocument.update({
      teams: teams.filter((item) => item.name !== ""),
    });

    if (response) {
      throwAlert("success", "Equipes atualizados!");
      setEditTeams(false);
      await getDocumentTeams();
    }

    setLoading(false);
  };

  const getDocumentDepartment = async () => {
    setLoading(true);
    const document = await departmentDocument.get();

    if (document) {
      setDepartments(document.departments);
    }
    setLoading(false);
  };

  const getDocumentTeams = async () => {
    setLoading(true);
    const document = await teamsDocument.get();

    if (document) {
      setTeams(document.data.teams);
    }
    setLoading(false);
  };

  return (
    <PageLayout title="Configurações">
      <ConfigNavigation slug={slug} />
      <MUI.Stack direction="row" gap="30px" overflow="hidden">
        <MUI.Box width="100%">
          <MUI.Stack
            width="100%"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <SimpleTitle margin="0">Áreas</SimpleTitle>
            {!editTeams && (
              <ButtonsActions
                addItem={addDepartmentItem}
                edit={editDepartments}
                loading={loading}
                save={saveDepartment}
                setEdit={setEditDepartments}
              />
            )}
          </MUI.Stack>
          <MUI.Box
            overflow="auto"
            height="calc(100% - 40px)"
            marginBottom="30px"
          >
            <Departments
              departments={departments}
              tabs={tabs}
              loading={loading}
              edit={editDepartments}
              changeItem={changeDepartmentItem}
              deleteItem={deleteDepartmentItem}
            />
          </MUI.Box>
        </MUI.Box>
        <MUI.Box width="100%">
          <MUI.Stack
            width="100%"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <SimpleTitle margin="0">Equipes</SimpleTitle>
            {!editDepartments && (
              <ButtonsActions
                addItem={addTeamsItem}
                edit={editTeams}
                loading={loading}
                save={saveTeams}
                setEdit={setEditTeams}
              />
            )}
          </MUI.Stack>
          <MUI.Box
            overflow="auto"
            height="calc(100% - 40px)"
            marginBottom="30px"
          >
            <Teams
              teams={teams}
              departments={departments}
              loading={loading}
              edit={editTeams}
              queues={queues}
              changeItem={changeTeamsItem}
              deleteItem={deleteTeamItem}
            />
          </MUI.Box>
        </MUI.Box>
      </MUI.Stack>
      <Backdrop loading={loading} />
    </PageLayout>
  );
};
