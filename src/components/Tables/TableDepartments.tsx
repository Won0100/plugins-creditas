import * as MUI from "@mui/material";
import * as MUIIcon from "@mui/icons-material";
import { CustomInput } from "../Custom/CustomInput";
import { ProgressCircular } from "../Progress/Circular";
import { DepartmentItemType } from "../../types/department";
import { Tabs } from "../../types/tabs";
import { TextTable } from "./styled";
import { CustomMultiSelect } from "components/Custom/CustomMultiSelect";
import React, { useState } from "react";
import { userInstance } from "services/manager/user";

type Props = {
  data: DepartmentItemType[];
  tabs: Tabs[];
  edit: boolean;
  changeItem: (
    id: string,
    key: keyof DepartmentItemType,
    value: string | string[]
  ) => void;
  loading: boolean;
  deleteItem: (id: string) => void;
};

type RowType = {
  department: DepartmentItemType;
  edit: boolean;
};

const Row = ({ department }: RowType) => {
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
          {department.name}
        </MUI.TableCell>
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
                    <MUI.Stack direction="row" justifyContent="space-around">
                      <TextTable>Atividades</TextTable>
                      <TextTable>Tabulações</TextTable>
                    </MUI.Stack>
                  </MUI.TableRow>
                </MUI.TableHead>
                <MUI.TableBody>
                  <MUI.TableRow
                    sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                  >
                    <MUI.Stack
                      direction="row"
                      justifyContent="space-around"
                      width="100%"
                    >
                      <MUI.Stack direction="column" width="40%">
                        {department.activities.map((activity, index) => (
                          <MUI.TableCell component="th" scope="row" key={index}>
                            <MUI.Chip label={activity} variant="outlined" />
                          </MUI.TableCell>
                        ))}
                      </MUI.Stack>
                      <MUI.Stack direction="column" width="40%">
                        {department.tabs.map((tab, index) => {
                          return (
                            <MUI.TableCell
                              component="th"
                              scope="row"
                              key={index}
                            >
                              <MUI.Chip
                                label={tab as unknown as string}
                                variant="outlined"
                              />
                            </MUI.TableCell>
                          );
                        })}
                      </MUI.Stack>
                    </MUI.Stack>
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

export const TableDepartments = ({
  data,
  tabs,
  edit,
  loading,
  changeItem,
  deleteItem,
}: Props) => {
  if (loading) {
    return <ProgressCircular />;
  }

  const [activities] = useState(userInstance.getActivities());
  const [tabsString, setTabsString] = React.useState<string[]>([]);

  React.useEffect(() => {
    setTabsString(tabs.map((tab) => tab.name));
  }, []);

  return (
    <MUI.Table aria-label="collapsible table">
      <MUI.TableHead>
        {!edit ? (
          <MUI.TableRow>
            <MUI.TableCell />
            <MUI.TableCell>Nome</MUI.TableCell>
            <MUI.TableCell />
          </MUI.TableRow>
        ) : (
          <MUI.Stack direction="row" justifyContent="space-around">
            <TextTable>Nome</TextTable>
          </MUI.Stack>
        )}
      </MUI.TableHead>
      <MUI.TableBody>
        {edit &&
          data.length > 0 &&
          data.map((department) => {
            return (
              <MUI.TableRow key={department.id}>
                <MUI.TableCell>
                  <MUI.Stack direction="row" width="100%" gap="20px">
                    <MUI.Stack direction="column" width="100%" gap="10px">
                      <MUI.Stack direction="row" gap="10px">
                        <CustomInput
                          width="100%"
                          height="36px"
                          label=""
                          placeholder=""
                          type="text"
                          value={department.name}
                          marginBottom="0"
                          Icon={MUIIcon.TextFields}
                          onChange={(e) =>
                            changeItem(department.id, "name", e.target.value)
                          }
                        />
                      </MUI.Stack>
                      <MUI.Stack direction="row" width="100%" gap="10px">
                        <CustomMultiSelect
                          width="100%"
                          label="Atividades"
                          placeholder=""
                          value={department.activities}
                          Icon={MUIIcon.FormatListBulleted}
                          options={activities?.map((item) => {
                            return {
                              label: item.name as string,
                              value: item.name as string,
                            };
                          })}
                          setValue={(e) =>
                            changeItem(department.id, "activities", e)
                          }
                        />
                        <CustomMultiSelect
                          width="100%"
                          label="Tabulações"
                          placeholder=""
                          value={department.tabs as unknown as string[]}
                          Icon={MUIIcon.FormatListBulleted}
                          allowDelete={true}
                          options={tabsString?.map((item) => {
                            return {
                              label: item as string,
                              value: item as string,
                            };
                          })}
                          setValue={(e) => changeItem(department.id, "tabs", e)}
                        />
                      </MUI.Stack>
                    </MUI.Stack>
                    <MUI.IconButton onClick={() => deleteItem(department.id)}>
                      <MUIIcon.Delete />
                    </MUI.IconButton>
                  </MUI.Stack>
                </MUI.TableCell>
              </MUI.TableRow>
            );
          })}
        {!edit &&
          data.map((department) => {
            return (
              <Row department={department} edit={edit} key={department.id} />
            );
          })}
      </MUI.TableBody>
    </MUI.Table>
  );
};
