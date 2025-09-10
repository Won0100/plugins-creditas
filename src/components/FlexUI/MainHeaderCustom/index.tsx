import * as MUI from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FC } from 'react';
import { MainHeaderChildrenProps, Actions } from '@twilio/flex-ui';
import * as S from './styled';

export const MainHeaderCustom: FC<MainHeaderChildrenProps> = ({ isSideNavOpen }) => {
    
    return (
        <MUI.AppBar color="secondary">
            <MUI.Toolbar variant="regular">
                <MUI.IconButton edge="start" aria-label="menu"
                    onClick={() => Actions.invokeAction("ToggleSidebar", { open: true })}
                >
                    <MenuIcon color="primary" />
                </MUI.IconButton>
                <S.ActivityStatus disabled={false} />
            </MUI.Toolbar>
        </MUI.AppBar>
    );
0}