import { Delete, TextFields } from "@mui/icons-material";
import * as MUI from "@mui/material";
import { CustomSelect } from "components/Custom/CustomSelect";
import { HiddenFlexQueueChannel } from "services/sync/hiddenWorkerDirectoryQueues";
import { TwilioTaskQueue } from "types/twilio";
import { ProgressCircular } from "../Progress/Circular";

type TableHiddenWorkerDirectoryQueuesProps = {
  data: string[];
  edit: boolean;
  handleChangeData: (channel: HiddenFlexQueueChannel, value: string) => void;
  loading: boolean;
  handleDeleteItemData: (
    channel: HiddenFlexQueueChannel,
    value: string
  ) => void;
  queues: TwilioTaskQueue[];
  channel: HiddenFlexQueueChannel;
};

export const TableHiddenWorkerDirectoryQueues = ({
  handleDeleteItemData,
  data,
  edit,
  loading,
  handleChangeData,
  channel,
  queues,
}: TableHiddenWorkerDirectoryQueuesProps) => {
  if (loading) {
    return <ProgressCircular />;
  }

  return (    
    <MUI.Table stickyHeader>
      <MUI.TableHead>
        <MUI.TableRow>
          <MUI.TableCell>Fila</MUI.TableCell>
        </MUI.TableRow>
      </MUI.TableHead>
      <MUI.TableBody>
        {data &&
          data.length &&
          edit &&
          data.map((item) => (
            <MUI.TableRow key={item}>
              <MUI.TableCell component="th" scope="row" align="center">
                <CustomSelect
                  disableMarginBottom={true}
                  width="100%"
                  height="36px"
                  value={item}
                  Icon={TextFields}
                  options={queues.map((queue: TwilioTaskQueue) => ({
                    label: queue.name,
                    value: queue.sid,
                  }))}
                  setValue={(e) => handleChangeData(channel, e)}
                />
              </MUI.TableCell>
              <MUI.TableCell align="right">
                <MUI.IconButton
                  onClick={() => handleDeleteItemData(channel, item)}
                >
                  <Delete />
                </MUI.IconButton>
              </MUI.TableCell>
            </MUI.TableRow>
          ))}
        {data &&
          data.length &&
          !edit &&
          data.map((item: string, index) => (
            <MUI.TableRow key={index}>
              <MUI.TableCell component="th" scope="row">
                {queues.find((queue: TwilioTaskQueue) => queue.sid === item)
                  ?.name || item}
              </MUI.TableCell>
            </MUI.TableRow>
          ))}
      </MUI.TableBody>
    </MUI.Table>    
  );
};
