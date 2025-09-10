import { ReactNode, useState } from 'react';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import * as S from './styles';
import { CustomButton } from '../../components/Custom/CustomButton';
import { AlertDialog } from '../Custom/CustomModal/AlertDialog';
import { localStorage } from '../../helpers/localStorage/actions';
import { invokeAction } from '../../actions/invoke';

type Props = {
    children: ReactNode;
    title?: string;
    description?: string;
    Breadcrumb?: ReactNode;
    ButtonsActions?: ReactNode;
}

export const PageLayout = ({ title, description, children, Breadcrumb, ButtonsActions }: Props) => {
    const [modalLogout, setModalLogout] = useState(false);

    const logout = async () => {
        localStorage.removeAll();
        await invokeAction.navigateToView('dialer-login');
    }

    return (
        <MUI.Box margin="32px 32px 0 32px" width="100%" overflow="hidden">
            <S.Header>
                <MUI.Box>
                    {!!title && <S.Title>{title}</S.Title>}                    
                    {!!description && <S.Description>{description}</S.Description>}
                    {!!Breadcrumb && Breadcrumb}
                </MUI.Box> 
                <MUI.ButtonGroup variant="contained" aria-label="Basic button group">
                    {!!ButtonsActions && ButtonsActions}
                    {window.location.pathname.includes('dialer') &&
                        <CustomButton
                            value="Sair"
                            Icon={MUIIcon.Logout}
                            onClick={() => setModalLogout(true)}
                            color="error"               
                        />
                    }
                </MUI.ButtonGroup>               
            </S.Header>            
            <MUI.Divider />
            <S.PageContainer>{children}</S.PageContainer>       
            <AlertDialog
                open={modalLogout}
                content="Deseja fazer logout?"
                cancel={() => setModalLogout(false)}
                confirm={logout}
            />     
        </MUI.Box>
    )
}