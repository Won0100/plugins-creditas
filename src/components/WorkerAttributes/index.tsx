import { useEffect, useState } from "react";
import * as MUI from "@mui/material";
import * as MUIIcon from "@mui/icons-material";
import { Actions, IWorker } from "@twilio/flex-ui";
import { readDocumentData } from "services/syncClient";
import { DepartmentItemType } from "types/department";
import { TeamsItemType } from "types/teams";
import { flexAgent } from "services/updateFlexAgent";
import { userInstance } from "services/manager/user";
import { CustomSelect } from "components/Custom/CustomSelect";
import { CustomButton } from "components/Custom/CustomButton";
import { CustomWorkerAttributes } from "types/workerAttributes";
import { CustomSwitch } from "components/Custom/CustomSwitch";

export const WorkerAttributes = (props: any) => {
  const [attributes, setAttributes] = useState<CustomWorkerAttributes>();
  //const [worker] = useState<IWorker>(props.worker);
  const [departments, setDepartments] = useState<DepartmentItemType[]>([]);
  const [departmentId, setDepartmentId] = useState<string>(
    props.worker.attributes.department_id
  );
  const [teamId, setTeamId] = useState<string>(props.worker.attributes.team_id);
  const [workerStatus, setWorkerStatus] = useState<boolean>(props.worker.attributes.active);
  const [teams, setTeams] = useState<TeamsItemType[]>([]);
  const [isDefaultValue, setIsDefaultValue] = useState(true);

  const onSubmit = async () => {
    const newTeam = teams.find((t) => t.id === teamId);
    const newDepartment = departments.find((d) => d.id === departmentId);

    await flexAgent.update(
      props.worker?.sid,
      JSON.stringify({
        ...props.worker?.attributes,
        area: newDepartment?.name,
        department: newDepartment?.name,
        department_id: departmentId,
        equipe: newTeam?.name,
        team: newTeam?.name,
        team_id: teamId,
        state: workerStatus ? "Active" : "Deleted",
        active: workerStatus,
      })
    );

    setIsDefaultValue(true);
    setAttributes({});

    Actions.invokeAction("SelectWorkerInSupervisor", {
      sid: undefined,
    });
  };

  const onReset = async () => {
    setDepartmentId(props.worker.attributes.department_id);
    setTeamId(props.worker.attributes.team_id);
    setWorkerStatus(props.worker.attributes.active);

    setIsDefaultValue(true);
  };

  const updateWorkerState = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWorkerStatus(event.target.checked);
  };

  const getDepartments = async () => {
    const departmentUniqueName = `departments-${
      userInstance.getAccount().accountSid
    }`;
    const data: any = await readDocumentData(departmentUniqueName);

    const departments: DepartmentItemType[] = data.departments;

    setDepartments(departments);
  };

  const getTeams = async () => {
    const teamsUniqueName = `teams-${userInstance.getAccount().accountSid}`;
    const data: any = await readDocumentData(teamsUniqueName);

    const teams: TeamsItemType[] = data.teams;

    setTeams(teams);
  };

  useEffect(() => {
    setDepartmentId(props.worker.attributes.department_id);
    setTeamId(props.worker.attributes.team_id);
    setWorkerStatus(props.worker.attributes.active);

    setAttributes(props.worker.attributes);
  }, [props.worker])

  useEffect(() => {
    (async () => {
      await Promise.all([getDepartments(), getTeams()]);
    })();
  }, []);

  useEffect(() => {
    if (
      attributes &&
      (departmentId !== attributes.department_id ||
        teamId !== attributes.team_id ||
        attributes.active !== workerStatus)
    ) {
      setIsDefaultValue(false);
    }

    const team = teams.find((t) => t.id === teamId);

    const departmentSelected = departments.find(
      (d) => d.id === team?.department
    );

    if (departmentSelected) {
      setDepartmentId(departmentSelected?.id);
    } else if (team && !departmentSelected) {
      setDepartmentId("");
    }
  }, [teamId, workerStatus]);

  return (
    <MUI.Stack
      direction="column"
      width="95%"
      gap="5px"
      alignSelf="center"
      marginBottom="10px"
    >
      <MUI.Divider orientation="horizontal" flexItem />
      <MUI.Typography variant="body1" gutterBottom component="div">
        Equipe
      </MUI.Typography>
      <CustomSelect
        width="100%"
        height="36px"
        label=""
        placeholder=""
        value={teamId}
        Icon={MUIIcon.TextFields}
        options={teams?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })}
        setValue={setTeamId}
      />
      <MUI.Typography variant="body1" gutterBottom component="div">
        Área
      </MUI.Typography>
      <CustomSelect
        width="100%"
        height="36px"
        label=""
        placeholder=""
        value={departmentId}
        Icon={MUIIcon.TextFields}
        options={departments?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })}
        setValue={setDepartmentId}
        disabled
      />
      <MUI.Stack direction="row" justifyContent="space-between">
        <MUI.Stack direction="row" gap="5px" alignItems="center">
          <MUI.Typography>Ativo?</MUI.Typography>
          <CustomSwitch
            status={workerStatus}
            handleChange={setWorkerStatus}
          />
        </MUI.Stack>
        <MUI.Stack direction="row" gap="5px" justifyContent="flex-end">
          <CustomButton
            Icon={MUIIcon.RestartAlt}
            value="Redefinir"
            margin="0"
            width="auto"
            onClick={onReset}
            disabled={isDefaultValue}
          />
          <CustomButton
            Icon={MUIIcon.Save}
            value="Salvar"
            margin="0"
            width="auto"
            onClick={onSubmit}
            disabled={isDefaultValue}
          />
        </MUI.Stack>
      </MUI.Stack>
    </MUI.Stack>
  );
};
