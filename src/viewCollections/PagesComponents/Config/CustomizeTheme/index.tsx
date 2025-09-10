import { ConfigNavigation } from "../ConfigNavigation"
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import { PageLayout } from '../../../../components/PageLayout';
import { CustomInput } from '../../../../components/Custom/CustomInput';
import { CustomButton } from '../../../../components/Custom/CustomButton';
import { useEffect, useState } from "react";
import { CustomThemeType, ThemeMode } from "../../../../types/theme";
import { themeDocument } from '../../../../services/sync/theme';
import { defaultTheme } from '../../../../helpers/theme/defaultTheme';
import { useSnackbar } from '../../../../hooks/useSnackbar';

type Props = {
    slug: string
}

export const CustomizeTheme = ({ slug }:Props) => {
    const [mode, setMode] = useState<ThemeMode>('light');
    const [theme, setTheme] = useState<CustomThemeType>(defaultTheme);
    const [loading, setLoading] = useState(false);

    const { throwAlert } = useSnackbar();

    useEffect(() => {
        (async () => await getCustomTheme())();
    }, []);

    const getCustomTheme = async () => {
        const customTheme = await themeDocument.get();

        if(customTheme) {
            setTheme(customTheme.data);
        } else {
            setTheme(defaultTheme);
        }
    }

    const saveTheme = async () => {
        setLoading(true);
        const response = await themeDocument.update(theme);
        
        if(response) {            
            throwAlert('success', 'Tema atualizado!');
            setTimeout(() => window.location.reload(), 4000);
        }

        setLoading(false);
    }

    return (        
        <PageLayout title="Configurações">
            <ConfigNavigation slug={slug} />
            <MUI.BottomNavigation
                    showLabels
                    value={mode}
                    onChange={(e, value) => {                        
                        setMode(value);
                    }}
                >
                <MUI.BottomNavigationAction value="light" label="Light" icon={<MUIIcon.LightMode />} />
                <MUI.BottomNavigationAction value="dark" label="Dark" icon={<MUIIcon.DarkMode />} />                
            </MUI.BottomNavigation>
            <MUI.Box marginTop="20px">
                <MUI.Box display="flex" justifyContent="space-between">
                    <CustomInput
                        label="Cor primária"
                        placeholder="Cor primária"
                        type="color"
                        value={theme[mode]?.primaryColor}
                        width="100%"
                        Icon={MUIIcon.ColorLens}
                        onChange={(e) => setTheme({ ...theme, [mode]: { ...theme[mode], primaryColor: e.target.value }})}
                        disabled={loading}
                    />
                    <CustomInput
                        label="Cor secundária"
                        placeholder="Cor secundária"
                        type="color"
                        value={theme[mode]?.secondaryColor}
                        width="100%"
                        Icon={MUIIcon.ColorLens}
                        onChange={(e) => setTheme({ ...theme, [mode]: { ...theme[mode], secondaryColor: e.target.value }})}
                        disabled={loading}
                    />
                </MUI.Box>
                <MUI.Box display="flex">
                    <CustomInput
                        label="URL Logo"
                        placeholder="URL Logo"
                        type="text"
                        value={theme[mode]?.logoUrl}      
                        width="100%"   
                        Icon={MUIIcon.Image}   
                        onChange={(e) => setTheme({ ...theme, [mode]: { ...theme[mode], logoUrl: e.target.value }})}       
                        disabled={loading}
                    />
                </MUI.Box>
                <MUI.Box display="flex">
                    <CustomButton 
                        value="Salvar" 
                        Icon={MUIIcon.Save} 
                        margin="20px 0" 
                        onClick={saveTheme}
                        disabled={loading}
                    />
                </MUI.Box>
            </MUI.Box>
        </PageLayout>     
    )
}