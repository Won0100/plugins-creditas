import * as MUI from '@mui/material';
import { CustomButton } from '../../../../components/Custom/CustomButton';
import { Add, Cancel, Edit, Save } from '@mui/icons-material';
import { Dispatch } from 'react';

type Props = {    
    edit: boolean;
    setEdit: Dispatch<boolean>;
    addItem: () => void;
    save: () => Promise<void>;
    loading: boolean;
}

export const ButtonsActions = ({ edit, setEdit, addItem, save, loading }: Props) => {
    return (
        <MUI.Stack direction="row" gap="20px" justifyContent="flex-end">
            {edit ? (
                <MUI.Stack direction="row" gap="20px">                        
                    <CustomButton
                        value="Salvar"
                        Icon={Save}
                        width="auto"   
                        disabled={loading}                                                
                        onClick={save}
                    />
                    <CustomButton
                        value="Adicionar"
                        Icon={Add}
                        width="auto"
                        onClick={addItem}
                        disabled={loading}
                    />
                    <CustomButton
                        value="Cancelar"
                        Icon={Cancel}
                        width="auto"   
                        onClick={() => setEdit(false)}    
                        disabled={loading}                                       
                    />
                </MUI.Stack>
            ) : (
                <CustomButton
                    value="Editar"
                    Icon={Edit}
                    width="auto"                           
                    onClick={() => setEdit(true)}    
                    disabled={loading}         
                />
            )}
        </MUI.Stack>
    )
}