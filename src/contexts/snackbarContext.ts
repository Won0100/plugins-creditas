import { createContext } from 'react';
import { SnackbarContextType } from '../types/snackbar';

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);