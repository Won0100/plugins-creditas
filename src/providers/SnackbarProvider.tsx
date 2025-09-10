import * as MUI from '@mui/material';
import { FC, useState } from 'react';
import { SnackbarContext } from '../contexts/snackbarContext';

export const SnackbarProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [snackbar, setSnackbar] = useState<{ show: boolean; message: string; severity: MUI.AlertColor }>({
        show: false,
        message: '',
        severity: 'info'
    });

    const throwAlert = (severity: MUI.AlertColor, message: string) => {
        setSnackbar({ show: true, severity, message });
    };

    const handleClose = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    return (
        <SnackbarContext.Provider value={{ throwAlert }}>
            {children}
            <MUI.Snackbar 
                open={snackbar.show} 
                autoHideDuration={4000} 
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <MUI.Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}                    
                >
                    {snackbar.message}
                </MUI.Alert>
            </MUI.Snackbar>
        </SnackbarContext.Provider>
    );
};