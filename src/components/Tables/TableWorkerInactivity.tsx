import { Delete, TextFields } from "@mui/icons-material";
import * as MUI from "@mui/material";
import { CustomSelect } from "components/Custom/CustomSelect";
import { CustomInput } from "../Custom/CustomInput";
import { ProgressCircular } from "../Progress/Circular";
import { AgentInactivityMapWithKey } from "types/worker";
import { TeamsItemType } from "types/teams";

type TableAgentInactivityProps = {
  data: AgentInactivityMapWithKey[];
  edit: boolean;
  teams: TeamsItemType[];
  handleChangeData: (
    key: string,
    field: string,
    value: string | number
  ) => void;
  loading: boolean;
  handleDeleteItemData: (key: string) => void;
};

export const TableAgentInactivity = ({
  handleDeleteItemData,
  data,
  edit,
  loading,
  handleChangeData,
  teams,
}: TableAgentInactivityProps) => {
  if (loading) {
    return <ProgressCircular />;
  }

  return (
    <MUI.Table>
      <MUI.TableHead>
        <MUI.TableRow>
          <MUI.TableCell>Equipe</MUI.TableCell>
          <MUI.TableCell>Tempo primeiro alerta (minutos)</MUI.TableCell>
          <MUI.TableCell>Tempo alerta recorrente (minutos)</MUI.TableCell>
        </MUI.TableRow>
      </MUI.TableHead>
      <MUI.TableBody>
        {data &&
          data.length &&
          edit &&
          data.map((item) => (
            <MUI.TableRow key={item.key}>
              <MUI.TableCell component="th" scope="row" align="center">
                <CustomSelect
                  disableMarginBottom={true}
                  width="100%"
                  height="36px"
                  disabled={item.key === "default"}
                  value={item.key}
                  Icon={TextFields}
                  options={[
                    {
                      label: "default",
                      value: "default",
                    },
                    ...teams.map((team: any) => ({
                      label: team.name,
                      value: team.id,
                    })),
                  ]}
                  setValue={(e) => handleChangeData(item.key, "key", e)}
                />
              </MUI.TableCell>
              <MUI.TableCell>
                <CustomInput
                  width="100%"
                  height="36px"
                  type="number"
                  value={Number(item.first)}
                  marginBottom="0"
                  textAlign="end"
                  Icon={TextFields}
                  onChange={(e) =>
                    handleChangeData(item.key, "first", Number(e.target.value))
                  }
                />
              </MUI.TableCell>
              <MUI.TableCell>
                <CustomInput
                  width="100%"
                  height="36px"
                  type="number"
                  value={Number(item.recurrent)}
                  marginBottom="0"
                  textAlign="end"
                  Icon={TextFields}
                  onChange={(e) =>
                    handleChangeData(
                      item.key,
                      "recurrent",
                      Number(e.target.value)
                    )
                  }
                />
              </MUI.TableCell>
              {item.key !== "default" && (
                <MUI.TableCell align="right">
                  <MUI.IconButton
                    onClick={() => handleDeleteItemData(item.key)}
                  >
                    <Delete />
                  </MUI.IconButton>
                </MUI.TableCell>
              )}
            </MUI.TableRow>
          ))}
        {data &&
          data.length &&
          !edit &&
          data.map((item: any, index: any) => (
            <MUI.TableRow key={index}>
              <MUI.TableCell component="th" scope="row">
                {teams.find((team: any) => team.id === item.key)?.name ||
                  "default"}
              </MUI.TableCell>
              <MUI.TableCell>{item.first || 0}</MUI.TableCell>
              <MUI.TableCell>{item.recurrent || 0}</MUI.TableCell>
            </MUI.TableRow>
          ))}
      </MUI.TableBody>
    </MUI.Table>
  );
};
