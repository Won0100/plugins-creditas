import { setProviders } from '@twilio/flex-ui';
import { SnackbarProvider } from '../providers/SnackbarProvider';
import { setTheme } from '../theme/index';
import { ThemeProviderMUI } from './ThemeProviderMUI';
import { SetThemeType } from '../types/theme';

export const setCustomProviders = async () => {
    const theme = await setTheme() as SetThemeType;

    setProviders({        
        CustomProvider: (RootComponent) => (props) => {
            return (
                <ThemeProviderMUI themeData={theme.themeData}>
                    <SnackbarProvider>
                        <RootComponent { ...props } />
                    </SnackbarProvider>
                </ThemeProviderMUI>
            )
        }
    });
}