import * as MUI from '@mui/material';
import { SimpleTitle } from '../../../commonStyled';
import { PageLayout } from '../../../../components/PageLayout';
import { ConfigNavigation } from '../ConfigNavigation';
import { CustomButton } from '../../../../components/Custom/CustomButton';
import { TableTaskInfo } from '../../../../components/Tables/TableTaskInfo';
import { InfoModeType, InfoFieldType } from '../../../../types/customizeTaskInfo'
import { useEffect, useState } from 'react';
import { Add, Cancel, Edit, Save } from '@mui/icons-material';
import { v4 as generateId } from 'uuid';
import { customizeTaskInfoDocument } from '../../../../services/sync/customizeTaskInfo';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { Backdrop } from '../../../../components/Backdrop';
import { defaultData } from '../../../../helpers/customizeTaskInfo/defaultData';

type Props = {
    slug: string;
}

export const TaskInfo = ({ slug }: Props) => {
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingGet, setLoadingGet] = useState(false);
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState(defaultData);

    const { throwAlert } = useSnackbar();

    useEffect(() => {
        (async () => await getDocument())();
    }, []);

    const addItem = (type: InfoModeType) => {
        const newState = { ...data };

        newState[type].push({ 
            id: generateId(),
            label: '', 
            value: '' 
        });

        setData(newState);
    }

    const changeData = (id: string, type: InfoModeType, field: InfoFieldType, value: string) => {
        const newState = { ...data };
        
        const itemToUpdate = newState[type].find(item => item.id === id);
    
        if(itemToUpdate) {
            itemToUpdate[field] = value;            
        }

        setData(newState);
    }

    const deleteItemData = (id: string, type: InfoModeType) => {
        const state = { ...data };
        const newState = state[type].filter(item => item.id !== id);

        setData({ ...state, [type]: newState });
    }

    const getDocument = async () => {   
        setLoadingGet(true);
        const document = await customizeTaskInfoDocument.get();
        
        if(document) {
            setData(document.data);
        }
        setLoadingGet(false);
    }

    const saveTaskInfo = async () => {
        setLoadingSave(true);
        const response = await customizeTaskInfoDocument.update(data);

        if(response) {
            throwAlert('success', 'Painel de dados da tarefa atualizado!');
            setEdit(false);
            await getDocument();
        }

        setLoadingSave(false);
    }

    return (
        <PageLayout title="Configurações">
            <ConfigNavigation slug={slug} />
            <MUI.Stack direction="row" width="100%" justifyContent="flex-end" marginBottom="20px">
                {edit ? (
                    <MUI.Stack direction="row" gap="20px">
                        <CustomButton
                            value="Salvar"
                            Icon={Save}
                            width="auto"   
                            disabled={loadingSave}                                                   
                            onClick={saveTaskInfo}
                        />
                        <CustomButton
                            value="Cancelar"
                            Icon={Cancel}
                            width="auto"   
                            onClick={() => setEdit(false)}    
                            disabled={loadingSave}                                       
                        />
                    </MUI.Stack>
                ) : (
                    <CustomButton
                        value="Editar"
                        Icon={Edit}
                        width="auto"                           
                        onClick={() => setEdit(true)}    
                        disabled={loadingSave}         
                    />
                )}            
            </MUI.Stack>            
            <MUI.Stack direction="row" gap="30px" height="100%">            
                <MUI.Box width="100%">
                    <MUI.Stack width="100%" direction="row" justifyContent="space-between" alignItems="center">
                        <SimpleTitle margin="0">Informações do cliente</SimpleTitle> 
                        {edit &&
                            <CustomButton
                                value="Adicionar"
                                Icon={Add}
                                width="auto"
                                onClick={() => addItem('infoCustomer')}
                                disabled={loadingSave}
                            />
                        }                        
                    </MUI.Stack>                    
                    <TableTaskInfo 
                        data={data}  
                        typeInfo="infoCustomer"                       
                        edit={edit}
                        changeData={changeData}
                        loadingGet={loadingGet}
                        deleteItemData={deleteItemData}
                    />               
                </MUI.Box>
                <MUI.Box width="100%">
                    <MUI.Stack width="100%" direction="row" justifyContent="space-between" alignItems="center">
                        <SimpleTitle margin="0">Informações do atendimento</SimpleTitle>
                        {edit &&
                            <CustomButton
                                value="Adicionar"
                                Icon={Add}
                                width="auto"
                                onClick={() => addItem('infoTask')}
                                disabled={loadingSave}                                                               
                            />
                        }                        
                    </MUI.Stack>                                        
                    <TableTaskInfo
                        data={data}     
                        typeInfo="infoTask"                                           
                        edit={edit}
                        changeData={changeData}
                        loadingGet={loadingGet}
                        deleteItemData={deleteItemData}
                    />
                </MUI.Box>                  
            </MUI.Stack>               
            <Backdrop loading={loadingGet || loadingSave} />
        </PageLayout>
    )
}