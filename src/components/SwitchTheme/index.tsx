import { useState } from 'react';
import { Container } from './styled';
import { setTheme } from '../../theme';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export const SwitchTheme = () => {
    const [isDark, setIsDark] = useState(localStorage.getItem('userPreferenceTheme') === 'dark')
    
    const handleChange = async (active: boolean) => {        
        setIsDark(active);
        
        localStorage.setItem('userPreferenceTheme', active ? 'dark' : 'light');

        await setTheme();
    }
    
    return (
        <Container value={isDark} checked={isDark} onClick={() => handleChange(!isDark)}>
            <div className="thumb">
                {isDark ? (
                    <DarkModeIcon />
                ) : (
                    <LightModeIcon />                    
                )}
            </div>
        </Container>
    )
}