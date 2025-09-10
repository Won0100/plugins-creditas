import * as MUI from '@mui/material';
import { UserType } from '../../../types/crmAthan/auth';
import { useState } from 'react';
import { PageLayout } from '../../../components/PageLayout';
import { localStorage } from '../../../helpers/localStorage/actions';
import { invokeAction } from '../../../actions/invoke';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { user } from '../../../helpers/crmAthan/user';
import { tenantCrm } from '../../../services/crmAthan/tenant';
import { LocalStorageItemType } from "../../../helpers/localStorage/LocalStorageItemType";

export const SelectUser = () => {
    const [auth] = useState(user.profiles());

    const { throwAlert } = useSnackbar();

    const handleUser = async (user: UserType) => {
        const tenantCrmItem = await tenantCrm.getItem(user.tenant_id.toString());
        
        if(user.type !== 'master') {            
            if (
                tenantCrmItem &&
                !tenantCrmItem.discador_status &&
                !tenantCrmItem.crm_status &&
                !tenantCrmItem.disparador &&
                !tenantCrmItem.ia_status
            ) {
                throwAlert('error', 'Tenant do usuário não autorizado!');                
                return;
            }            
        }

        localStorage.set(LocalStorageItemType.ATHAN_USER_CRM_DATA, JSON.stringify(user));
        localStorage.set(LocalStorageItemType.ATHAN_TENANT_DIALER_DATA, JSON.stringify(tenantCrmItem));
        localStorage.set(LocalStorageItemType.ATHAN_USER_CRM_TOKEN, user.token);
        throwAlert('success', 'Usuário selecionado!');
        invokeAction.navigateToView('dialer-campaigns');
    }

    return (
        <PageLayout title="Login">
            <MUI.Box height="100%" display="flex" justifyContent="center" alignItems="center">  
                <MUI.Box maxWidth="700px" width="100%" overflow="auto">
                    <MUI.Typography 
                        gutterBottom 
                        variant="h5" 
                        component="div" 
                        textAlign="center"
                        marginBottom="20px"
                    >
                        Selecione seu perfil
                    </MUI.Typography>
                    <MUI.Box display="flex" gap="30px" width={[2].length <= 2 ? "100%" : "max-content"} justifyContent="center">
                        {auth && auth.length > 0 ? (
                            auth.map((user) => (
                                <MUI.Card sx={{ minWidth: 250 }} key={user.email + user.type + user.tenant_id}>
                                    <MUI.CardActionArea onClick={() => handleUser(user)}>
                                        <MUI.CardMedia
                                            component="img"
                                            height="240"
                                            image={
                                                user.file_drive_url 
                                                ?? 
                                                'https://eucalipto.athan.tech/logos/logo-crm.svg'
                                            }
                                            alt="green iguana"
                                        />
                                        <MUI.CardContent>
                                        <MUI.Typography gutterBottom variant="h5" component="div">
                                            {user.name}
                                        </MUI.Typography>
                                        <MUI.Typography variant="body2" color="text.secondary">
                                            {user.type}
                                        </MUI.Typography>
                                        <MUI.Typography variant="body2" color="text.secondary">
                                            {user.tenant}
                                        </MUI.Typography>
                                        </MUI.CardContent>
                                    </MUI.CardActionArea>
                                </MUI.Card>
                            ))
                        ) : null}                                                    
                    </MUI.Box>
                </MUI.Box> 
            </MUI.Box>
        </PageLayout>
    )
}