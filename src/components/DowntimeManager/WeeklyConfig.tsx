import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { CustomTextarea } from "components/Custom/CustomTextarea";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface WeeklyTiming {
  dayOfWeek: string;
  begin: string;
  end: string;
  key: string;
}

interface WeeklyConfigProps {
  value?: {
    weeklyTimings: any; // Adjust to your specific structure
    offlineMessage?: string;
  };
  addToStagedChanges?: (changes: any) => void;
  isReadOnly: boolean;
}

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const WeeklyConfig = ({
  value,
  addToStagedChanges,
  isReadOnly,
}: WeeklyConfigProps) => {
  const [hoopRows, setHoopRows] = useState<WeeklyTiming[]>([]);
  const [weeklyOfflineMessage, setWeeklyOfflineMessage] = useState("");

  const convertWeeklyTimingsToHoopList = (configObj: any): WeeklyTiming[] => {
    if (!configObj || !configObj.weeklyTimings) {
      return [];
    }

    const tempHoopRows: WeeklyTiming[] = [];

    DAYS_OF_WEEK.forEach((x) => {
      let existing = configObj.weeklyTimings[x];
      if (existing) {
        if (!Array.isArray(existing)) {
          existing = [existing];
        }

        existing.forEach((row: any) => {
          tempHoopRows.push({
            dayOfWeek: x,
            begin: row.begin,
            end: row.end,
            key: uuidv4(),
          });
        });
      }
    });

    tempHoopRows.sort((a, b) => {
      if (a.dayOfWeek === b.dayOfWeek) {
        const beginningTimeA = moment(a.begin, "kk:mm");
        const beginningTimeB = moment(b.begin, "kk:mm");
        return (
          beginningTimeA.toDate().getTime() - beginningTimeB.toDate().getTime()
        );
      }
      return (
        DAYS_OF_WEEK.indexOf(a.dayOfWeek) - DAYS_OF_WEEK.indexOf(b.dayOfWeek)
      );
    });

    return tempHoopRows;
  };

  const convertHoopListToWeeklyTimings = (rows: WeeklyTiming[]): any => {
    const tempWeeklyTimings: any = {};
    DAYS_OF_WEEK.forEach((d) => {
      tempWeeklyTimings[d] = rows
        .filter((x) => x.dayOfWeek === d && x.begin && x.end)
        .map((x) => {
          return { begin: x.begin, end: x.end };
        });
    });
    return tempWeeklyTimings;
  };

  useEffect(() => {
    setHoopRows(convertWeeklyTimingsToHoopList(value));
    setWeeklyOfflineMessage(value?.offlineMessage || "");
  }, [value]);

  useEffect(() => {
    if (addToStagedChanges) {
      addToStagedChanges({
        offlineMessage: weeklyOfflineMessage,
        weeklyTimings: convertHoopListToWeeklyTimings(hoopRows),
      });
    }
  }, [hoopRows, weeklyOfflineMessage]);

  const handleChangeWeeklyOfflineMessage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setWeeklyOfflineMessage(e.target.value);
  };

  const handleAddNewHoopRow = () => {
    setHoopRows((ogList) => [
      ...ogList,
      { dayOfWeek: "Segunda", begin: "", end: "", key: uuidv4() },
    ]);
  };

  const handleDeleteHoopRow = (key: string) => {
    return () => {
      setHoopRows((ogList) => {
        return ogList.filter((row) => row.key !== key);
      });
    };
  };

  const handleUpdateHoopRowDayOfWeek = (key: string) => {
    return (e: SelectChangeEvent<string>) => {
      setHoopRows((ogList) => {
        return ogList.map((li) => {
          if (key === li.key) {
            return { ...li, dayOfWeek: e.target.value as string };
          }
          return li;
        });
      });
    };
  };

  const handleUpdateHoopRowTime = (key: string, fieldName: string) => {
    return (evt: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue =
        evt.target.value === ""
          ? ""
          : moment(evt.target.value, "HH:mm").format("HH:mm");

      setHoopRows((ogList) => {
        return ogList.map((li) => {
          if (key === li.key) {
            return { ...li, [fieldName]: formattedValue };
          }
          return li;
        });
      });
    };
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <InputLabel>Horário da operação:</InputLabel>
          {!isReadOnly && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddNewHoopRow}
              startIcon={<AddIcon />}
            >
              Adicionar novo
            </Button>
          )}
        </Stack>
        <br />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dia</TableCell>
                <TableCell>Horário de início</TableCell>
                <TableCell>Horário final</TableCell>
                {!isReadOnly && <TableCell>Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {hoopRows.map((hoopRow) => (
                <TableRow key={`hoop-edit-row-${hoopRow.key}`}>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel></InputLabel>
                      <Select
                        value={hoopRow.dayOfWeek}
                        onChange={handleUpdateHoopRowDayOfWeek(hoopRow.key)}
                        disabled={isReadOnly}
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      value={hoopRow.begin}
                      onChange={handleUpdateHoopRowTime(hoopRow.key, "begin")}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      value={hoopRow.end}
                      onChange={handleUpdateHoopRowTime(hoopRow.key, "end")}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={handleDeleteHoopRow(hoopRow.key)}
                      >
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <CustomTextarea
          label="Mensagem de inatividade"
          placeholder="Mensagem de inatividade"
          value={weeklyOfflineMessage}
          setValue={handleChangeWeeklyOfflineMessage}
          width="100%"
          rows={5}
          disabled={isReadOnly}
        />
      </Box>
    </Stack>
  );
};
