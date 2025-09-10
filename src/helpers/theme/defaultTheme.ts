import { CustomThemeType } from '../../types/theme';
import LogoBlue from '../../assets/images/svg/logo-blue.svg';
import Logo from '../../assets/images/svg/logo.svg';

export const defaultTheme: CustomThemeType = {
    light: {
        primaryColor: '#2d4c71',
        secondaryColor: '#ffffff',
        logoUrl: LogoBlue
    },
    dark: {
        primaryColor: '#ffffff',
        secondaryColor: '#2d4c71',
        logoUrl: Logo
    }
}