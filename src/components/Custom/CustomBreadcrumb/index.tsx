import * as MUI from '@mui/material';
import * as S from './styled';
import { invokeAction } from '../../../actions/invoke';

type Props = {
    title: string;
    subtitle: string;
    path: string;
}

export const CustomBreadcrumb = ({ title, subtitle, path }: Props) => {
    return (        
        <MUI.Breadcrumbs aria-label="breadcrumb">            
            <S.ButtonBreadcrumb
                variant="text"
                onClick={() => invokeAction.navigateToView(path)}                
            >
                {title}
            </S.ButtonBreadcrumb>            
            <MUI.Typography 
                color="text.primary"                
            >{subtitle}</MUI.Typography>
        </MUI.Breadcrumbs>        
    )
}