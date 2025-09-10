import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomInput } from "../../components/Custom/CustomInput";
import { CustomTextarea } from "../../components/Custom/CustomTextarea";

type PartialDay = {
  title: string;
  offlineMessage: string;
  date: string;
  key: string;
  begin: string;
  end: string;
};

interface PartialDayMap {
  [key: string]: {
    description: string;
    offlineMessage: string;
    begin: string;
    end: string;
  };
}

type PartialDayConfigProps = {
  value: PartialDayMap;
  addToStagedChanges?: (changes: PartialDayMap) => void;
  isReadOnly?: boolean;
};

export const PartialDayConfig = ({
  value,
  addToStagedChanges,
  isReadOnly = false,
}: PartialDayConfigProps) => {
  const [partialDayList, setPartialDayList] = useState<PartialDay[]>([]);
  const [confirmDeleteDialogIsOpen, setConfirmDeleteDialogIsOpen] =
    useState<boolean>(false);
  const [rowPendingDeletion, setRowPendingDeletion] = useState<string>("");

  const convertPartialDayMapToList = (
    partialDayMap: PartialDayMap
  ): PartialDay[] => {
    const tempPartialDayList = Object.keys(partialDayMap).map((k) => {
      const mapValue = partialDayMap[k];
      return {
        title: mapValue.description,
        date: moment(k, "MM/DD/yyyy").format("yyyy-MM-DD"),
        offlineMessage: mapValue.offlineMessage,
        key: uuidv4(),
        begin: mapValue.begin,
        end: mapValue.end,
      };
    });

    tempPartialDayList.sort((a: any, b: any) => a.date - b.date);
    return tempPartialDayList;
  };

  const convertPartialDayListToMap = (
    partialDayListObj: PartialDay[]
  ): PartialDayMap => {
    const tempPartialDayMap: PartialDayMap = {};
    partialDayListObj.forEach((partialDay) => {
      tempPartialDayMap[
        moment(partialDay.date, "yyyy-MM-DD").format("MM/DD/yyyy")
      ] = {
        description: partialDay.title,
        offlineMessage: partialDay.offlineMessage,
        begin: partialDay.begin,
        end: partialDay.end,
      };
    });
    return tempPartialDayMap;
  };

  useEffect(() => {
    setPartialDayList(convertPartialDayMapToList(value || {}));
  }, [value]);

  useEffect(() => {
    if (addToStagedChanges) {
      addToStagedChanges(convertPartialDayListToMap(partialDayList));
    }
  }, [partialDayList]);

  const addNewPartialDay = () => {
    setPartialDayList((ogList) => [
      ...ogList,
      {
        title: "",
        date: moment().format("yyyy-MM-DD"),
        offlineMessage: "",
        key: uuidv4(),
        begin: "",
        end: "",
      },
    ]);
  };

  const updatePartialDayConfig = (partialDayKey: any, partialDayField: any) => {
    return (e: any) => {
      setPartialDayList((ogList) => {
        return ogList.map((li) => {
          if (partialDayKey === li.key) {
            return { ...li, [partialDayField]: e.target.value };
          }
          return li;
        });
      });
    };
  };

  const updatePartialDayTime = (partialDayKey: any, partialDayField: any) => {
    return (evt: any) => {
      const formattedValue = evt.target.value === "" ? "" : evt.target.value;
      setPartialDayList((ogList) => {
        return ogList.map((li) => {
          if (partialDayKey === li.key) {
            return { ...li, [partialDayField]: formattedValue };
          }
          return li;
        });
      });
    };
  };

  const handleRequestDeletion = (key: string) => () => {
    setRowPendingDeletion(key);
    setConfirmDeleteDialogIsOpen(true);
  };

  const handleCancelDeletion = () => {
    setRowPendingDeletion("");
    setConfirmDeleteDialogIsOpen(false);
  };

  const handleConfirmDeletion = () => {
    setPartialDayList((ogList) =>
      ogList.filter((item) => item.key !== rowPendingDeletion)
    );
    setRowPendingDeletion("");
    setConfirmDeleteDialogIsOpen(false);
  };

  return (
    <div>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">Dias parciais:</Typography>
          {!isReadOnly && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addNewPartialDay}
            >
              Adicionar novo
            </Button>
          )}
        </Stack>

        {partialDayList.length === 0 && (
          <Typography>Não há dias parciais configurados</Typography>
        )}

        {partialDayList.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nº</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Horário de início</TableCell>
                <TableCell>Horário final</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Mensagem de inatividade</TableCell>
                {!isReadOnly && <TableCell>Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {partialDayList.map((partialDay, partialDayIter) => (
                <TableRow key={partialDay.key}>
                  <TableCell>{partialDayIter + 1}</TableCell>
                  <TableCell>
                    <CustomInput
                      required={true}
                      placeholder="Data"
                      label="Data"
                      type="date"
                      value={partialDay.date}
                      onChange={updatePartialDayTime(partialDay.key, "date")}
                      disabled={isReadOnly}
                    />
                  </TableCell>
                  <TableCell>
                    <CustomInput
                      required={true}
                      placeholder="Hora inicial"
                      label="Hora inicial"
                      type="time"
                      value={partialDay.begin}
                      onChange={updatePartialDayTime(partialDay.key, "begin")}
                      disabled={isReadOnly}
                    />
                  </TableCell>
                  <TableCell>
                    <CustomInput
                      required={true}
                      placeholder="Hora final"
                      label="Hora final"
                      type="time"
                      value={partialDay.end}
                      onChange={updatePartialDayTime(partialDay.key, "end")}
                      disabled={isReadOnly}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={partialDay.title}
                      onChange={updatePartialDayConfig(partialDay.key, "title")}
                      placeholder="Identificação"
                      disabled={isReadOnly}
                    />
                  </TableCell>
                  <TableCell>
                    <CustomTextarea
                      value={partialDay.offlineMessage}
                      label="Mensagem de inatividade"
                      setValue={updatePartialDayConfig(
                        partialDay.key,
                        "offlineMessage"
                      )}
                      placeholder="Mensagem de inatividade"
                      disabled={isReadOnly}
                      rows={3}
                      width="100%"
                    />
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell>
                      <IconButton
                        onClick={handleRequestDeletion(partialDay.key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={confirmDeleteDialogIsOpen} onClose={handleCancelDeletion}>
          <DialogTitle>Deletar linha</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você tem certeza que quer deletar essa linha? Essa ação não pode
              ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDeletion} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDeletion} color="secondary" autoFocus>
              Deletar
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </div>
  );
};
