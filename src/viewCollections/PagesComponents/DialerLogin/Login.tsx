import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import * as S from './styled';
import { CustomInput } from '../../../components/Custom/CustomInput';
import { CustomButton } from '../../../components/Custom/CustomButton';
import { useState } from 'react';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { crmAthan } from '../../../services/crmAthan/login';
import { localStorage } from '../../../helpers/localStorage/actions';
import { invokeAction } from '../../../actions/invoke';
import EucaliptoLogo from '../../../assets/images/svg/logo-eucalipto.svg';
import { LocalStorageItemType } from "../../../helpers/localStorage/LocalStorageItemType";

export const Login = () => {    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { throwAlert } = useSnackbar();

    const handleLogin = async () => {  
        setLoading(true);

        if(email && password) {
            const response = await crmAthan.login(email, password);

            if(typeof(response) === 'string') {
                throwAlert('error', response);   
                setLoading(false);
                return;                
            }

            if(response && response.auth.length > 0) {
                throwAlert('success', 'Login realizado!');
                localStorage.set(LocalStorageItemType.ATHAN_AUTH_CRM_DATA, JSON.stringify(response.auth))
                invokeAction.navigateToView('dialer-select-user');
            }
        } else {
            throwAlert('error', 'Preencher email e senha!');
        }

        setLoading(false);
    }

    return (
        <MUI.Box width="100%" display="flex" justifyContent="center" alignItems="center">            
            <S.ContainerForm>
                <S.Img src={EucaliptoLogo} />
                <CustomInput
                    label="Email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    Icon={MUIIcon.Email}
                    width="100%"
                    disabled={loading}
                />
                <CustomInput
                    label="Senha"
                    placeholder="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    Icon={MUIIcon.Password}     
                    width="100%" 
                    disabled={loading}              
                />
                <MUI.Link 
                    href="https://eucalipto.athan.tech/forgot-password" 
                    target="_blank"                    
                >
                    Esqueceu a senha?
                </MUI.Link>
                <CustomButton 
                    Icon={MUIIcon.Login} 
                    value="Entrar"
                    margin="20px auto"  
                    align="center"  
                    onClick={handleLogin}   
                    disabled={loading}             
                />
            </S.ContainerForm>
        </MUI.Box>
    )
}