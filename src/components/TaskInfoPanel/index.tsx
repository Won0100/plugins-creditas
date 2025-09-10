import * as MUI from "@mui/material";
import { FC, useEffect, useState } from "react";
import { SimpleTitle } from "../../viewCollections/commonStyled";
import { customizeTaskInfoDocument } from "../../services/sync/customizeTaskInfo";
import { TaskInfoPanelProps } from "@twilio/flex-ui/src/components/canvas/TaskInfoPanel";
import { defaultData } from "../../helpers/customizeTaskInfo/defaultData";
import { CustomizeTaskInfoType } from "../../types/customizeTaskInfo";
import { object } from "../../helpers/object";
import { Text } from "./styled";

export const TaskInfoPanel: FC<TaskInfoPanelProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CustomizeTaskInfoType>(defaultData);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const document = await customizeTaskInfoDocument.get();

      if (document) {
        setData(document.data);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <MUI.Stack direction="column" height="100%" overflow="auto" gap="20px">
      <MUI.Stack>
        <SimpleTitle>Informações do atendimento</SimpleTitle>
        <MUI.Table>
          <MUI.TableBody>
            {props.task &&
              data?.infoTask?.map((item) => {
                const value = object.getNestedProperty(props, item.value);
                const stringValue = value ? value.toString() : "";
                const isMarkdownLink = stringValue.match(
                  /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/
                );

                return (
                  <MUI.TableRow key={item.id}>
                    <MUI.TableCell>
                      <Text>{item.label}</Text>
                    </MUI.TableCell>
                    <MUI.TableCell>
                      {isMarkdownLink ? (
                        <MUI.Link href={isMarkdownLink[2]} target="_blank">
                          {isMarkdownLink[1]}
                        </MUI.Link>
                      ) : stringValue.startsWith("http") ? (
                        <MUI.Link href={stringValue} target="_blank">
                          Abrir link
                        </MUI.Link>
                      ) : (
                        <Text>{stringValue}</Text>
                      )}
                    </MUI.TableCell>
                  </MUI.TableRow>
                );
              })}
          </MUI.TableBody>
        </MUI.Table>
      </MUI.Stack>
      <MUI.Stack>
        <SimpleTitle>Informações do cliente</SimpleTitle>
        <MUI.Table>
          <MUI.TableBody>
            {props.task &&
              data?.infoCustomer?.map((item) => {
                const value = object.getNestedProperty(props, item.value);
                const stringValue = value ? value.toString() : "";
                const isMarkdownLink = stringValue.match(
                  /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/
                );

                return (
                  <MUI.TableRow key={item.id}>
                    <MUI.TableCell>
                      <Text>{item.label}</Text>
                    </MUI.TableCell>
                    <MUI.TableCell>
                      {isMarkdownLink ? (
                        <MUI.Link href={isMarkdownLink[2]} target="_blank">
                          {isMarkdownLink[1]}
                        </MUI.Link>
                      ) : stringValue.startsWith("http") ? (
                        <MUI.Link href={stringValue} target="_blank">
                          Abrir link
                        </MUI.Link>
                      ) : (
                        <Text>{stringValue}</Text>
                      )}
                    </MUI.TableCell>
                  </MUI.TableRow>
                );
              })}
          </MUI.TableBody>
        </MUI.Table>
      </MUI.Stack>
    </MUI.Stack>
  );
};
