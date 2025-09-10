import * as MUIIcon from "@mui/icons-material";
import * as MUI from "@mui/material";
import { TaskRouterQueue } from "@twilio/flex-ui/src/core/FlexDataClient";
import { CustomEmailInput } from "components/Custom/CustomEmailInput";
import * as React from "react";
import { DepartmentItemType } from "../../types/department";
import { TeamsItemType } from "../../types/teams";
import { CustomInput } from "../Custom/CustomInput";
import { CustomMultiSelect } from "../Custom/CustomMultiSelect";
import { CustomSelect } from "../Custom/CustomSelect";
import { ProgressCircular } from "../Progress/Circular";
import { TextTable } from "./styled";

type MainProps = {
  teams: TeamsItemType[];
  loading: boolean;
  edit: boolean;
  departments: DepartmentItemType[];
  queues: TaskRouterQueue[];
  changeItem: (
    id: string,
    key: keyof TeamsItemType,
    value: string | string[]
  ) => void;
  deleteItem: (id: string) => void;
};

type RowType = {
  team: TeamsItemType;
  edit: boolean;
  departmentName: string;
};

const Row = ({ team, departmentName }: RowType) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <MUI.TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <MUI.TableCell>
          <MUI.IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <MUIIcon.KeyboardArrowUp /> : <MUIIcon.KeyboardArrowDown />}
          </MUI.IconButton>
        </MUI.TableCell>
        <MUI.TableCell component="th" scope="row">
          {team.name}
        </MUI.TableCell>
        <MUI.TableCell align="right">{departmentName}</MUI.TableCell>
      </MUI.TableRow>
      <MUI.TableRow>
        <MUI.TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <MUI.Collapse in={open} timeout="auto" unmountOnExit>
            <MUI.Box sx={{ margin: 1 }}>
              <MUI.Typography variant="h6" gutterBottom component="div">
                Detalhes
              </MUI.Typography>
              <MUI.Table size="small" aria-label="purchases">
                <MUI.TableHead>
                  <MUI.TableRow>
                    <MUI.TableCell>Filas</MUI.TableCell>
                  </MUI.TableRow>
                </MUI.TableHead>
                <MUI.TableBody>
                  <MUI.TableRow
                    sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                  >
                    {team.queues.map((queue, index) => (
                      <MUI.TableCell component="th" scope="row" key={index}>
                        <MUI.Chip label={queue} variant="outlined" />
                      </MUI.TableCell>
                    ))}
                  </MUI.TableRow>
                </MUI.TableBody>
              </MUI.Table>
            </MUI.Box>
          </MUI.Collapse>
        </MUI.TableCell>
      </MUI.TableRow>
    </React.Fragment>
  );
};

export const TableTeams = ({
  teams,
  loading,
  edit,
  departments,
  queues,
  changeItem,
  deleteItem,
}: MainProps) => {
  if (loading) {
    return <ProgressCircular />;
  }

  return (
    <MUI.Table aria-label="collapsible table">
      <MUI.TableHead>
        {!edit ? (
          <MUI.TableRow>
            <MUI.TableCell />
            <MUI.TableCell>Nome</MUI.TableCell>
            <MUI.TableCell align="right">Área</MUI.TableCell>
            <MUI.TableCell />
          </MUI.TableRow>
        ) : (
          <MUI.Stack direction="row" justifyContent="space-around">
            <TextTable>Nome</TextTable>
            <TextTable>Área</TextTable>
          </MUI.Stack>
        )}
      </MUI.TableHead>
      <MUI.TableBody>
        {edit &&
          teams.length > 0 &&
          teams.map((team) => {
            return (
              <MUI.TableRow key={team.id}>
                <MUI.TableCell>
                  <MUI.Stack direction="row" width="100%" gap="20px">
                    <MUI.Stack direction="column" width="100%">
                      <MUI.Stack direction="row" gap="10px">
                        <CustomInput
                          width="100%"
                          height="36px"
                          label=""
                          placeholder=""
                          type="text"
                          value={team.name}
                          marginBottom="0"
                          Icon={MUIIcon.TextFields}
                          onChange={(e) =>
                            changeItem(team.id, "name", e.target.value)
                          }
                        />
                        <CustomSelect
                          width="100%"
                          height="36px"
                          label=""
                          placeholder=""
                          value={team.department}
                          Icon={MUIIcon.TextFields}
                          options={departments?.map((item) => {
                            return {
                              label: item.name,
                              value: item.id,
                            };
                          })}
                          setValue={(e) => changeItem(team.id, "department", e)}
                        />
                      </MUI.Stack>
                      <CustomMultiSelect
                        width="100%"
                        label="Filas"
                        placeholder=""
                        value={team.queues}
                        Icon={MUIIcon.FormatListBulleted}
                        options={queues?.map((item) => {
                          return {
                            label: item.name as string,
                            value: item.name as string,
                          };
                        })}
                        setValue={(e) => changeItem(team.id, "queues", e)}
                      />
                      <CustomEmailInput<TeamsItemType>
                        changeItem={changeItem}
                        stateEmails={team.supervisorsEmail}
                        stateId={team.id}
                        stateLabel="supervisorsEmail"
                      />
                    </MUI.Stack>
                    <MUI.IconButton onClick={() => deleteItem(team.id)}>
                      <MUIIcon.Delete />
                    </MUI.IconButton>
                  </MUI.Stack>
                </MUI.TableCell>
              </MUI.TableRow>
            );
          })}
        {!edit &&
          teams.map((team) => {
            const departmentName =
              departments?.find((item) => item.id === team.department)?.name ||
              "";
            return (
              <Row
                team={team}
                edit={edit}
                key={team.id}
                departmentName={departmentName}
              />
            );
          })}
      </MUI.TableBody>
    </MUI.Table>
  );
};
