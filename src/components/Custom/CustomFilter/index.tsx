import * as MUI from '@mui/material';
import { Search } from '@mui/icons-material';
import { CustomButton } from '../../../components/Custom/CustomButton';
import { MouseEventHandler, ReactNode } from 'react';

type Props = {
    children: ReactNode;
    onFilter: MouseEventHandler<HTMLButtonElement>;
}

export const CustomFilter = ({ children, onFilter }: Props) => {
    return (
        <MUI.Stack 
            direction="row" 
            //alignItems="center"              
            marginTop="20px"
            flexWrap="wrap"
            gap="10px"
        >
            {children}
            <CustomButton
                Icon={Search}
                value="Buscar"
                margin="0"   
                width="auto" 
                onClick={onFilter}                            
            />
        </MUI.Stack>
    )
}