import { ReactNode } from 'react';

export type CustomColorType = {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
}

export type CustomThemeType = {    
    light: CustomColorType;
    dark: CustomColorType;
}

export type ThemeMode = 'light' | 'dark';

export type ThemeProviderType = {    
    themeData: CustomThemeType;    
    children: ReactNode;
}

export type SetThemeType = {
    userPreferenceTheme: ThemeMode;
    themeData: CustomThemeType;
}