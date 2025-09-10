import { AlertColor } from "@mui/material";

export type ThrowAlertType = (severity: AlertColor, message: string) => void;

export type SnackbarContextType = {
    throwAlert: ThrowAlertType;
};