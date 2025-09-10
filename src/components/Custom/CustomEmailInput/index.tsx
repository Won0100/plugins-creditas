import * as MUI from "@mui/material";
import * as MUIIcon from "@mui/icons-material";
import { util } from "helpers/util";
import React, { useState } from "react";
import { CustomInput } from "../CustomInput";

interface Props<T> {
  changeItem: (id: string, key: keyof T, value: string[]) => void;
  stateEmails: string[];
  stateId: string;
  stateLabel: keyof T;
}

export const CustomEmailInput = <T,>({
  changeItem,
  stateEmails,
  stateId,
  stateLabel,
}: Props<T>) => {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteEmail = (email: string) => {
    const getEmailIndex = stateEmails.findIndex(
      (stateEmail) => stateEmail === email
    );

    stateEmails.splice(getEmailIndex, 1);

    changeItem(stateId, stateLabel, stateEmails);
  };

  return (
    <React.Fragment>
      <MUI.Tooltip
        title="Digite o email e clique em Enter para adicioná-lo na lista de supervisores"
        arrow
        placement="top-start"
      >
        <CustomInput
          width="100%"
          height="36px"
          label="Email do supervisor"
          placeholder=""
          type="text"
          value={email}
          marginBottom="0"
          Icon={MUIIcon.TextFields}
          error={!!error}
          helperText={error}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const isValid = util.validateEmail(email!);

              if (!isValid) {
                setError("Email digitado não é valido");
                return;
              }

              const checkAlreadyExists =
                stateEmails &&
                stateEmails.find((stateEmail) => stateEmail === email);

              if (checkAlreadyExists) {
                setError("Email digitado já está na lista");
                return;
              }

              const updatedEmails = [
                ...(stateEmails ? stateEmails : []),
                email,
              ] as string[];

              changeItem(stateId, stateLabel, updatedEmails);

              setEmail(null);
              setError(null);
            }
          }}
        />
      </MUI.Tooltip>
      {stateEmails && (
        <MUI.Box display="flex" padding="1rem">
          {stateEmails.map((email) => {
            return (
              <MUI.Chip
                label={email}
                variant="outlined"
                onDelete={() => handleDeleteEmail(email)}
              />
            );
          })}
        </MUI.Box>
      )}
    </React.Fragment>
  );
};
