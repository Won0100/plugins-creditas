import * as MUI from "@mui/material";
import { FC, useEffect, useState } from "react";
import { SimpleTitle } from "../../viewCollections/commonStyled";
import { customizeTaskInfoDocument } from "../../services/sync/customizeTaskInfo";
import { TaskInfoPanelProps } from "@twilio/flex-ui/src/components/canvas/TaskInfoPanel";
import { defaultData } from "../../helpers/customizeTaskInfo/defaultData";
import { CustomizeTaskInfoType } from "../../types/customizeTaskInfo";
import { object } from "../../helpers/object";
import { Text } from "./styled";
import { useSelector } from "react-redux";

export const TaskInfoPanel: FC<TaskInfoPanelProps> = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CustomizeTaskInfoType>(defaultData);
  console.debug('props:: ', props)
  //acessa o state do flex
  const flexState = useSelector((state: any) => state.flex);
  console.debug('flexState:: ', flexState)
  //acessa a task de dentro da lista de tasks do state de acordo com o sid da reservation
  const taskState = flexState.worker.tasks.get(props.task.sid) ? flexState.worker.tasks.get(props.task.sid) : props.task
  console.debug('taskState:: ', taskState)
  //determina se o componente esta sendo renderizado na tela do agente ou na tela do supervisor
  const task = props.task._source ? taskState : props.task
  console.debug('valida tela:: ', props.task._source ? 'tem _source' : 'não tem _source')
  console.debug('task:: ', task)
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
                const value = object.getNestedProperty(task, item.value);
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
                const value = object.getNestedProperty(task, item.value);
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
