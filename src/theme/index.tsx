import { Manager, MainHeader } from '@twilio/flex-ui';
import { ThemeTwilio } from './ThemeTwilio';
import { defaultTheme } from '../helpers/theme/defaultTheme';
import { themeDocument } from '../services/sync/theme';
import { ThemeMode, CustomThemeType } from '../types/theme';

export const setTheme = async () => {
    try {
        const userPreferenceTheme = localStorage.getItem('userPreferenceTheme') ?? 'dark';
        let themeData = defaultTheme;

        const customTheme = await themeDocument.get();
        
        if(customTheme) {
            themeData = customTheme.data; 
        }

        MainHeader.defaultProps.logoUrl = themeData[userPreferenceTheme as keyof CustomThemeType].logoUrl;

        Manager.getInstance().updateConfig({
            theme: ThemeTwilio(userPreferenceTheme === 'light' ? true : false, themeData),
        });        

        return { themeData };
    } catch(err) {
        if(err instanceof Error)
        console.error('setTheme: ', err.message);
    }    
}