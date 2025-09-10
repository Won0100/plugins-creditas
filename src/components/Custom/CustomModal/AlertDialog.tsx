import * as MUI from '@mui/material';
import { MouseEventHandler } from 'react';

type Props = {
    open: boolean;  
    content: string;  
    confirm: MouseEventHandler<HTMLButtonElement>;
    cancel: MouseEventHandler<HTMLButtonElement>;
}

export const AlertDialog = ({ open, content, confirm, cancel }: Props) => {
    return (
        <MUI.Dialog
            open={open}
            keepMounted
            onClose={cancel}
            aria-describedby="alert-dialog-slide-description"                          
        >
            <MUI.DialogTitle>Flex - Eucalipto</MUI.DialogTitle>
            <MUI.DialogContent>
                <MUI.DialogContentText id="alert-dialog-slide-description">
                    {content}
                </MUI.DialogContentText>
            </MUI.DialogContent>
            <MUI.DialogActions>
                <MUI.Button onClick={cancel}>Cancelar</MUI.Button>
                <MUI.Button onClick={confirm}>Confirmar</MUI.Button>
            </MUI.DialogActions>
        </MUI.Dialog>
    );    
}