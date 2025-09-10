import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { CustomTextarea } from "../../components/Custom/CustomTextarea";

type Holiday = {
  title: string;
  offlineMessage: string;
  date: string;
  key: string;
};

interface HolidayMap {
  [key: string]: {
    description: string;
    offlineMessage: string;
  };
}

interface HolidayConfigProps {
  value: HolidayMap;
  addToStagedChanges: (changes: HolidayMap) => void;
  isReadOnly: boolean;
}

export const HolidayConfig = ({
  value,
  addToStagedChanges,
  isReadOnly,
}: HolidayConfigProps) => {
  const [holidayList, setHolidayList] = useState<Holiday[]>([]);
  const [confirmDeleteDialogIsOpen, setConfirmDeleteDialogIsOpen] =
    useState(false);
  const [rowPendingDeletion, setRowPendingDeletion] = useState<string>("");

  const convertHolidayMapToList = (holidayMap: HolidayMap): Holiday[] => {
    const tempHolidayList = Object.keys(holidayMap).map((k) => {
      const mapValue = holidayMap[k];
      return {
        title: mapValue.description,
        date: moment(k, "MM/DD/yyyy").format("yyyy-MM-DD"),
        offlineMessage: mapValue.offlineMessage,
        key: uuidv4(),
      };
    });

    tempHolidayList.sort((a: Holiday, b: Holiday) =>
      a.date > b.date ? 1 : -1
    );
    return tempHolidayList;
  };

  const convertHolidayListToMap = (holidayListObj: Holiday[]): HolidayMap => {
    const tempHolidayMap: HolidayMap = {};
    holidayListObj.forEach((holiday) => {
      tempHolidayMap[moment(holiday.date, "yyyy-MM-DD").format("MM/DD/yyyy")] =
        {
          description: holiday.title,
          offlineMessage: holiday.offlineMessage,
        };
    });
    return tempHolidayMap;
  };

  useEffect(() => {
    setHolidayList(convertHolidayMapToList(value || {}));
  }, [value]);

  useEffect(() => {
    if (addToStagedChanges) {
      addToStagedChanges(convertHolidayListToMap(holidayList));
    }
  }, [holidayList]);

  const addNewHoliday = () => {
    setHolidayList((ogList) => [
      ...ogList,
      {
        title: "",
        date: moment().format("yyyy-MM-DD"),
        offlineMessage: "",
        key: uuidv4(),
      },
    ]);
  };

  const updateHolidayConfig = (
    holidayKey: string,
    holidayField: keyof Holiday
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHolidayList((ogList) =>
        ogList.map((li) =>
          holidayKey === li.key ? { ...li, [holidayField]: e.target.value } : li
        )
      );
    };
  };

  const handleRequestDeletion = (key: string) => {
    return () => {
      setRowPendingDeletion(key);
      setConfirmDeleteDialogIsOpen(true);
    };
  };

  const handleCancelDeletion = () => {
    setRowPendingDeletion("");
    setConfirmDeleteDialogIsOpen(false);
  };

  const handleConfirmDeletion = () => {
    setHolidayList((ogList) =>
      ogList.filter((item) => item.key !== rowPendingDeletion)
    );
    setRowPendingDeletion("");
    setConfirmDeleteDialogIsOpen(false);
  };

  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <InputLabel>Feriados:</InputLabel>
        {!isReadOnly && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addNewHoliday}
          >
            Adicionar novo
          </Button>
        )}
      </Stack>

      {holidayList.length === 0 ? (
        <Typography>Sem feriados configurados</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Mensagem de inatividade</TableCell>
                {!isReadOnly && <TableCell>Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {holidayList.map((holiday) => (
                <TableRow key={holiday.key}>
                  <TableCell>
                    <TextField
                      type="date"
                      value={holiday.date}
                      onChange={updateHolidayConfig(holiday.key, "date")}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      value={holiday.title}
                      onChange={updateHolidayConfig(holiday.key, "title")}
                      placeholder="Nome do feriado"
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <CustomTextarea
                      width="100%"
                      rows={3}
                      value={holiday.offlineMessage}
                      label="Mensagem de inatividade"
                      setValue={updateHolidayConfig(
                        holiday.key,
                        "offlineMessage"
                      )}
                      placeholder="Mensagem de inatividade"
                      disabled={isReadOnly}
                    />
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={handleRequestDeletion(holiday.key)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmDeleteDialogIsOpen} onClose={handleCancelDeletion}>
        <DialogTitle>Excluir linha</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que quer deletar essa linha? Essa ação não pode ser
            revertida.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeletion} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeletion} color="secondary">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
