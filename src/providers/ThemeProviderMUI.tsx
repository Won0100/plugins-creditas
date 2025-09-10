import React from 'react';
import { 
  StylesProvider, 
  createGenerateClassName  
} from '@material-ui/core/styles';
import { ThemeProvider } from '@emotion/react';
import { ThemeProviderType } from '../types/theme';
import { createThemeMUI } from '../theme/createThemeMUI';
import { Manager } from '@twilio/flex-ui';

export const ThemeProviderMUI = ({ themeData, children }: ThemeProviderType) => {
  const theme = createThemeMUI(themeData);

  const manager = Manager.getInstance();

  return (
    <StylesProvider generateClassName={createGenerateClassName({
      productionPrefix: manager.serviceConfiguration.account_sid,
      seed: manager.serviceConfiguration.account_sid,           
    })}>       
      <ThemeProvider theme={theme}>{children}</ThemeProvider>            
    </StylesProvider>
  );
};
