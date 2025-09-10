import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { CustomTextarea } from "../../components/Custom/CustomTextarea";

interface EmergencyConfigProps {
  value: {
    emergencyShutdown: boolean;
    emergencyShutdownMessage: string;
  };
  addToStagedChanges: (changes: {
    emergencyShutdown: boolean;
    emergencyShutdownMessage: string;
  }) => void;
  isReadOnly: boolean;
}

export const EmergencyConfig = ({
  value,
  addToStagedChanges,
  isReadOnly,
}: EmergencyConfigProps) => {
  const [unplannedShutdownFlag, setUnplannedShutdownFlag] = useState(false);
  const [unplannedShutdownMessage, setUnplannedShutdownMessage] = useState("");

  useEffect(() => {
    setUnplannedShutdownFlag(value?.emergencyShutdown);
    setUnplannedShutdownMessage(value?.emergencyShutdownMessage);
  }, [value]);

  useEffect(() => {
    if (addToStagedChanges) {
      addToStagedChanges({
        emergencyShutdown: unplannedShutdownFlag,
        emergencyShutdownMessage: unplannedShutdownFlag
          ? unplannedShutdownMessage
          : "",
      });
    }
  }, [unplannedShutdownFlag, unplannedShutdownMessage]);

  const handleUnplannedShutdownFlagChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUnplannedShutdownFlag(event.target.value === "true");
  };

  const handleUnplannedShutdownMessageChange = (e: any) => {
    setUnplannedShutdownMessage(e.target.value);
  };

  return (
    <Stack direction="row" spacing={2}>
      <Box>
        <FormControl component="fieldset" disabled={isReadOnly}>
          <FormLabel component="legend">Configuração de emergência:</FormLabel>
          <RadioGroup
            aria-label="emergency-switch"
            name="emergency-switch"
            value={String(unplannedShutdownFlag)}
            onChange={handleUnplannedShutdownFlagChange}
          >
            <FormControlLabel value="true" control={<Radio />} label="Ativo" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Desabilitado"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {unplannedShutdownFlag && (
        <Box>
          <FormControl fullWidth>
            <CustomTextarea
              label="Mensagem de inatividade"
              placeholder="Mensagem de inatividade"
              value={unplannedShutdownMessage}
              setValue={handleUnplannedShutdownMessageChange}
              disabled={isReadOnly}
              width="100%"
              rows={3}
            />
          </FormControl>
        </Box>
      )}
    </Stack>
  );
};
