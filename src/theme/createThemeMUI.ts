import { createTheme } from '@mui/material';
import { CustomThemeType } from '../types/theme';

export const createThemeMUI = (themeData: CustomThemeType) => {
  if(!themeData.dark || !themeData.light) return {};
  
  return createTheme({    
    palette: {
      mode: localStorage.getItem('userPreferenceTheme') === 'light' ? 'light' : 'dark',
      primary: {
        main: localStorage.getItem('userPreferenceTheme') === 'light' 
        ? themeData.light.primaryColor 
        : themeData.dark.primaryColor
      },
      secondary: {
        main: localStorage.getItem('userPreferenceTheme') === 'light' 
        ? themeData.light.secondaryColor 
        : themeData.dark.secondaryColor
      }           
    },   
    typography: {
      fontFamily: '"Inter var experimental", "Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
    }                
  })
}