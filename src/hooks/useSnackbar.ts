import { useContext } from 'react';
import { SnackbarContext } from '../contexts/snackbarContext';
import { SnackbarContextType } from '../types/snackbar';

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};